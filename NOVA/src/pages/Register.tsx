import React, { useState, useEffect } from 'react';

// 1. Bulletproof global variable declaration for the AOS animation library
declare const AOS: any;

// 2. Clear interfaces for state data structures
export interface RegistrationFormFields {
  name: string;
  rollno: string;
  email: string;
  phone: string;
  year: string;
  interests: string[];
  message: string;
}

export interface FieldErrors {
  [key: string]: string;
}

// Safe metadata lookup configuration for Vite environments
const API_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3001';
const MAX_MESSAGE_LENGTH = 1000;

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormFields>({
    name: '',
    rollno: '',
    email: '',
    phone: '',
    year: '',
    interests: [],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    // Accessing our declared global directly removes the window scope layout errors
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        once: true
      });
    }
  }, []);

  // 3. Combined event element type handler for HTML form elements
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Enforce message input character limits safely within the handler thread
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field errors dynamically as the user types a correction
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setResponseMessage('');
    setFieldErrors({});

    try {
      const response = await fetch(`${API_URL}/api/clubregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = (await response.json()) as { message?: string; field?: string };

      if (response.ok) {
        setSubmitStatus('success');
        setResponseMessage(data.message || 'Application submitted successfully!');

        // Full form reset state execution
        setFormData({
          name: '',
          rollno: '',
          email: '',
          phone: '',
          year: '',
          interests: [],
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setResponseMessage(data.message || 'Something went wrong. Please try again.');

        if (data.field) {
          setFieldErrors({ [data.field]: data.message || 'Invalid entry' });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setResponseMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - formData.message.length;

  return (
    <section className="register-page">
      <div className="register-container">
        <div className="register-content" data-aos="fade-right">
          <h3>Become a Member</h3>
          <p>
            Join our community of tech enthusiasts and get access to exclusive events,
            workshops, and networking opportunities.
          </p>

          <div className="benefits-image">
            <img
              src="https://img.freepik.com/free-vector/team-goals-concept-illustration_114360-5176.jpg"
              alt="NOVA Benefits"
            />
          </div>

          <ul className="benefits-list">
            <li>
              <i className="fas fa-check-circle"></i>
              Access to all NOVA events and workshops
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Networking opportunities with industry professionals
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Hands-on experience with cutting-edge technologies
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Mentorship from senior members and alumni
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Opportunity to work on real-world projects
            </li>
          </ul>
        </div>

        <div className="register-form" data-aos="fade-left">
          <div className="form-header">
            <img
              src="https://img.freepik.com/free-vector/sign-concept-illustration_114360-125.jpg"
              alt="Register"
              className="form-image"
            />
            <h3>Registration Form</h3>
          </div>

          <form id="membership-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.name && (
                <span className="error-text">{fieldErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rollno">Roll Number</label>
              <input
                type="text"
                id="rollno"
                name="rollno"
                value={formData.rollno}
                onChange={handleInputChange}
                placeholder="e.g., 2451-xx-xxx-xxx"
                required
              />
              {fieldErrors.rollno && (
                <span className="error-text">{fieldErrors.rollno}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder=" eg., 2451xxxxxxxx@mvsrec.edu.in"
                required
              />
              {fieldErrors.email && (
                <span className="error-text">{fieldErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91XXXXXXXXXX"
                required
              />
              {fieldErrors.phone && (
                <span className="error-text">{fieldErrors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="year">Year of Study</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="form-group">
              <label>Areas of Interest</label>
              <div className="checkbox-group">
                {['web', 'app', 'ai', 'cybersecurity', 'blockchain', 'iot'].map((track) => (
                  <label key={track}>
                    <input
                      type="checkbox"
                      name="interests"
                      value={track}
                      checked={formData.interests.includes(track)}
                      onChange={handleCheckboxChange}
                    />
                    {track === 'web' && 'Web Development'}
                    {track === 'app' && 'App Development'}
                    {track === 'ai' && 'AI & Machine Learning'}
                    {track === 'cybersecurity' && 'Cybersecurity'}
                    {track === 'blockchain' && 'Blockchain'}
                    {track === 'iot' && 'IoT'}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Why do you want to join NOVA?
                <span className="char-counter" style={{
                  float: 'right',
                  fontSize: '0.85rem',
                  color: remainingChars < 100 ? '#ff6b6b' : 'var(--gray-text)'
                }}>
                  {remainingChars} characters remaining
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                maxLength={MAX_MESSAGE_LENGTH}
                required
              />
              {remainingChars < 100 && (
                <span style={{
                  fontSize: '0.8rem',
                  color: '#ff9800',
                  display: 'block',
                  marginTop: '0.3rem'
                }}>
                  {remainingChars === 0 ? 'Maximum character limit reached' : 'Approaching character limit'}
                </span>
              )}
            </div>

            {submitStatus === 'success' && responseMessage && (
              <div className="alert alert-success">
                {responseMessage}
              </div>
            )}

            {submitStatus === 'error' && responseMessage && (
              <div className="alert alert-error">
                {responseMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn primary-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;