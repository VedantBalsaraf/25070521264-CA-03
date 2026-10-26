import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    clearError();
    try {
      await login({ email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {(authError || errors.form) && (
        <div className="alert alert-error mb-4 flex items-center gap-2" role="alert">
          <AlertCircle size={20} />
          <span>{authError || errors.form}</span>
        </div>
      )}

      <div className="input-group">
        <label htmlFor="email" className="input-label">Email Address</label>
        <div className="input-wrapper">
          <Mail className="input-icon" size={20} aria-hidden="true" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
            disabled={loading}
            autoComplete="email"
            autoFocus
          />
        </div>
      </div>

      <div className="input-group">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="input-label">Password</label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm text-primary-600 hover:underline"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="input-wrapper">
          <Lock className="input-icon" size={20} aria-hidden="true" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            placeholder="Enter your password"
            error={errors.password}
            disabled={loading}
            autoComplete="current-password"
            rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Need help signing in? <a href="mailto:hello@borrowcircles.com" className="text-primary-600 hover:underline">Contact support</a>
      </p>

      <Button type="submit" className="btn-full" size="lg" loading={loading}>
        Sign In
      </Button>

      <p className="auth-footer">
        Don't have an account? <Link to="/signup" className="auth-footer-link">Sign up</Link>
      </p>
    </form>
  );
}
