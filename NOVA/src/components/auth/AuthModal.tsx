import React, { useState } from 'react';
import { supabase } from '../../services/supabase/supabaseClient';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Optional: show a "check your email" message
        setError("Check your email for the confirmation link!");
        return;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google Auth failed');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>

        <div className="auth-modal-header">
          <h2>{isLogin ? 'Welcome Back' : 'Join NOVA'}</h2>
          <p>{isLogin ? 'Sign in to access your dashboard' : 'Create an account to start your journey'}</p>
        </div>

        {error && <div className="auth-modal-error">{error}</div>}

        <form onSubmit={handleEmailAuth} className="auth-modal-form">
          <div className="auth-input-group">
            <i className="fas fa-envelope" />
            <input
              type="email"
              placeholder="College Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <i className="fas fa-lock" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="auth-google-btn" onClick={handleGoogleLogin} type="button">
          <i className="fab fa-google" />
          Continue with Google
        </button>

        <div className="auth-modal-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-switch-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
