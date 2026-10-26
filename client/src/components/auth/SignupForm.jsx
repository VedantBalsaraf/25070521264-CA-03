import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../utils/formatters';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Shield } from 'lucide-react';
import { DEPARTMENTS, YEARS } from '../../utils/constants';

export function SignupForm() {
  const { signup, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    department: '',
    year: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('weak');

  const checkPasswordStrength = (password) => {
    let strength = 'weak';
    if (password.length >= 8) strength = 'fair';
    if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) strength = 'good';
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength = 'strong';
    setPasswordStrength(strength);
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (!/^[A-Z0-9]+$/.test(formData.rollNumber)) {
      newErrors.rollNumber = 'Roll number can only contain uppercase letters and numbers';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
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
      await signup({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        rollNumber: formData.rollNumber.toUpperCase(),
        department: formData.department,
        year: parseInt(formData.year, 10)
      });
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
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
    if (field === 'password') {
      checkPasswordStrength(value);
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      }
    }
    if (field === 'confirmPassword') {
      if (value && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
    if (field === 'rollNumber') {
      setFormData(prev => ({ ...prev, [field]: value.toUpperCase() }));
    }
  };

  const strengthColors = {
    weak: 'bg-error-500',
    fair: 'bg-warning-500',
    good: 'bg-primary-500',
    strong: 'bg-success-500'
  };

  const strengthLabels = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong'
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
        <label htmlFor="name" className="input-label">Full Name</label>
        <div className="input-wrapper">
          <User className="input-icon" size={20} aria-hidden="true" />
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="John Doe"
            error={errors.name}
            disabled={loading}
            autoComplete="name"
            autoFocus
          />
        </div>
      </div>

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
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="password" className="input-label">Password</label>
        <div className="input-wrapper">
          <Lock className="input-icon" size={20} aria-hidden="true" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            placeholder="Create a strong password"
            error={errors.password}
            disabled={loading}
            autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>
        <div className="password-strength" role="progressbar" aria-valuenow={['weak', 'fair', 'good', 'strong'].indexOf(passwordStrength) + 1} aria-valuemin={1} aria-valuemax={4} aria-label="Password strength">
          <div className="password-strength-bar active weak" />
          <div className="password-strength-bar active fair" />
          <div className="password-strength-bar active good" />
          <div className="password-strength-bar active strong" />
        </div>
        <p className="password-strength-label">
          Password strength: <span className={cn('font-medium', strengthColors[passwordStrength])}>{strengthLabels[passwordStrength]}</span>
        </p>
      </div>

      <div className="input-group">
        <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
        <div className="input-wrapper">
          <Lock className="input-icon" size={20} aria-hidden="true" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={e => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            disabled={loading}
            autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="rollNumber" className="input-label">Roll Number</label>
        <div className="input-wrapper">
          <Shield className="input-icon" size={20} aria-hidden="true" />
          <Input
            id="rollNumber"
            type="text"
            value={formData.rollNumber}
            onChange={e => handleChange('rollNumber', e.target.value)}
            placeholder="CS2021001"
            error={errors.rollNumber}
            disabled={loading}
            autoComplete="off"
            maxLength={20}
          />
        </div>
        <p className="input-hint">Uppercase letters and numbers only (e.g., CS2021001)</p>
      </div>

      <div className="input-group">
        <label htmlFor="department" className="input-label">Department</label>
        <select
          id="department"
          value={formData.department}
          onChange={e => handleChange('department', e.target.value)}
          className="input-field"
          error={errors.department}
          disabled={loading}
          aria-invalid={errors.department ? 'true' : 'false'}
        >
          <option value="">Select your department</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="year" className="input-label">Year</label>
        <select
          id="year"
          value={formData.year}
          onChange={e => handleChange('year', e.target.value)}
          className="input-field"
          error={errors.year}
          disabled={loading}
          aria-invalid={errors.year ? 'true' : 'false'}
        >
          <option value="">Select your year</option>
          {YEARS.map(year => (
            <option key={year} value={year}>Year {year}</option>
          ))}
        </select>
      </div>

      <Button type="submit" className="btn-full" size="lg" loading={loading}>
        Create Account
      </Button>

      <p className="auth-footer text-center text-sm text-gray-600">
        Use any valid email address you can access for account updates.
      </p>

      <p className="auth-footer">
        Already have an account? <Link to="/login" className="auth-footer-link">Sign in</Link>
      </p>
    </form>
  );
}
