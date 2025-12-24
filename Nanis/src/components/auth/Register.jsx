import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '/assets/icons/logo.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    job_title: '',
    company: '',
    phone: '',
    bio: '',
    avatar: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field-specific error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({ 
        ...validationErrors, 
        [e.target.name]: undefined 
      });
    }

    // Clear combined name error when user edits first or last name
    if ((e.target.name === 'first_name' || e.target.name === 'last_name') && validationErrors.name) {
      setValidationErrors({
        ...validationErrors,
        name: undefined,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    const payloadName = (formData.name && formData.name.trim()) || `${(formData.first_name || '').trim()} ${(formData.last_name || '').trim()}`.trim();

    const result = await register(
      payloadName,
      formData.email,
      formData.password,
      formData.password_confirmation,
      formData.job_title,
      formData.company,
      formData.phone,
      formData.bio,
      formData.avatar
    );

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registration failed');
      if (result.errors) setValidationErrors(result.errors);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl">

        <div className="bg-white border border-gray-200 rounded-xl shadow-md px-8 py-10 max-h-[90vh] overflow-y-auto">

          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-8">
            {/* <div className="bg-indigo-600 rounded-full px-8 py-4 mb-4">
              <img src={logo} alt="Nanis logo" className="h-8 w-auto" />
            </div> */}

            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Create your Nanis account
            </h2>

            <p className="text-sm text-gray-500 mt-1 text-center">
              Never miss a message, anywhere
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">

            {error && (
              <div className="sm:col-span-2 animate-shake bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name (First / Surname) */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`w-full px-4 py-3 rounded-lg border text-sm
                    ${validationErrors.first_name || validationErrors.name ? 'border-red-500' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                <input
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Surname"
                  className={`w-full px-4 py-3 rounded-lg border text-sm
                    ${validationErrors.last_name || validationErrors.name ? 'border-red-500' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              {validationErrors.name && (
                <p className="text-red-600 text-xs mt-1 sm:col-span-2">
                  {Array.isArray(validationErrors.name) 
                    ? validationErrors.name[0] 
                    : validationErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.email) 
                    ? validationErrors.email[0] 
                    : validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.password) 
                    ? validationErrors.password[0] 
                    : validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.password_confirmation && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.password_confirmation) 
                    ? validationErrors.password_confirmation[0] 
                    : validationErrors.password_confirmation}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g. Marketing Manager"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.job_title ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.job_title && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.job_title) 
                    ? validationErrors.job_title[0] 
                    : validationErrors.job_title}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.company ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.company && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.company) 
                    ? validationErrors.company[0] 
                    : validationErrors.company}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 123-4567"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.phone && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.phone) 
                    ? validationErrors.phone[0] 
                    : validationErrors.phone}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself..."
                rows="3"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.bio ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
              />
              {validationErrors.bio && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.bio) 
                    ? validationErrors.bio[0] 
                    : validationErrors.bio}
                </p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                name="avatar"
                type="url"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className={`w-full px-4 py-3 rounded-lg border text-sm
                  ${validationErrors.avatar ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.avatar && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.avatar) 
                    ? validationErrors.avatar[0] 
                    : validationErrors.avatar}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-2 w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg
                bg-indigo-600 hover:bg-indigo-700 hover:shadow-md
                text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <p className="sm:col-span-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Log in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
