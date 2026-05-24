import { useState } from 'react';

// 1. Define exactly what your Form Data looks like
export interface RegistrationFormData {
  teamName: string;
  teamLeader: string; // This holds the email based on your code
  teamLeaderPhone: string;
  participant1Name: string;
  participant1Phone: string;
  participant2Name?: string; // Optional field
  participant2Phone?: string; // Optional field
  participant3Name?: string; // Optional field
  participant3Phone?: string; // Optional field
  transactionId: string;
  paymentProof: File | null;
}

// 2. Define the shape of your dynamic error state object
export interface FormErrors {
  [key: string]: string;
}

// 3. Define the message state layout
interface StatusMessage {
  text: string;
  type: 'success' | 'error' | '';
}

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useRegistrationForm = (apiEndpoint: string = `${API_BASE_URL}/api/register`) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<StatusMessage>({ text: '', type: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string | undefined): boolean => {
    const emailRegex = /^2451\d{2}\d{3}\d{3}@mvsrec\.edu\.in$/;
    return !!(email && emailRegex.test(email));
  };

  const validatePhone = (phone: string | undefined): boolean => {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return !!(phone && phoneRegex.test(phone.replace(/\s/g, '')));
  };

  const validateText = (value: string | undefined, minLength: number = 2): boolean => {
    return !!(value && value.trim().length >= minLength);
  };

  const clearError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const validateForm = (formData: RegistrationFormData): boolean => {
    const newErrors: FormErrors = {};

    // Team Name
    if (!validateText(formData.teamName, 2)) {
      newErrors.teamName = 'Team Name is required (min 2 characters)';
    }

    // Team Leader Email
    if (!validateEmail(formData.teamLeader)) {
      newErrors.teamLeader = 'Please enter a valid email address';
    }

    // Team Leader Phone
    if (!validatePhone(formData.teamLeaderPhone)) {
      newErrors.teamLeaderPhone = 'Please enter a valid phone number';
    }

    // Participant 1 Name and Phone
    if (!validateText(formData.participant1Name, 2)) {
      newErrors.participant1Name = 'Participant 1 Name is required (min 2 characters)';
    }

    if (!validatePhone(formData.participant1Phone)) {
      newErrors.participant1Phone = 'Please enter a valid phone number';
    }

    // Participant 2 - Phone required if name is provided
    if (formData.participant2Name && !validatePhone(formData.participant2Phone)) {
      newErrors.participant2Phone = 'Phone number required for Participant 2';
    }

    // Participant 3 - Phone required if name is provided
    if (formData.participant3Name && !validatePhone(formData.participant3Phone)) {
      newErrors.participant3Phone = 'Phone number required for Participant 3';
    }

    // Transaction ID
    if (!validateText(formData.transactionId, 5)) {
      newErrors.transactionId = 'Transaction ID is required (min 5 characters)';
    }

    // Payment Proof
    if (!formData.paymentProof) {
      newErrors.paymentProof = 'Payment proof screenshot is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitRegistration = async (formData: RegistrationFormData): Promise<{ success: boolean; teamId: string | null }> => {
    if (!validateForm(formData)) {
      return { success: false, teamId: null };
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    // Prepare members array with phone numbers
    interface Member {
      name: string;
      phone: string;
    }

    const members: Member[] = [
      {
        name: formData.participant1Name,
        phone: formData.participant1Phone
      }
    ];

    if (formData.participant2Name && formData.participant2Phone) {
      members.push({
        name: formData.participant2Name,
        phone: formData.participant2Phone
      });
    }

    if (formData.participant3Name && formData.participant3Phone) {
      members.push({
        name: formData.participant3Name,
        phone: formData.participant3Phone
      });
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('teamName', formData.teamName);
    submitData.append('teamLeaderEmail', formData.teamLeader);
    submitData.append('teamLeaderPhone', formData.teamLeaderPhone);
    submitData.append('members', JSON.stringify(members));
    submitData.append('transactionId', formData.transactionId);

    if (formData.paymentProof) {
      submitData.append('paymentProof', formData.paymentProof);
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: submitData,
        signal: AbortSignal.timeout(15000) // Increased timeout for file upload
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({
          message: `Server error: ${response.status}`
        })) as { message?: string };
        throw new Error(errorResult.message || 'Registration failed');
      }

      const result = await response.json() as { success: boolean; teamId?: string; message?: string };

      if (result.success) {
        setMessage({
          text: "Registration successful! We'll contact you soon.",
          type: 'success'
        });
        return { success: true, teamId: result.teamId || null };
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      setMessage({
        text: errorMessage,
        type: 'error'
      });
      return { success: false, teamId: null };
    } finally {
      setLoading(false);
    }
  };

  return { submitRegistration, loading, message, errors, clearError };
};