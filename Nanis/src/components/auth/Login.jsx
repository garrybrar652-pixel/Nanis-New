import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '/assets/icons/logo.svg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field-specific error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: undefined
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      // Handle validation errors from backend
      if (result.errors && Object.keys(result.errors).length > 0) {
        setValidationErrors(result.errors);
      }
      setError(result.message || 'Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        <div className="bg-white border border-gray-200 rounded-xl shadow-md px-8 py-10">

          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-8">
            {/* <div className="bg-indigo-600 rounded-full px-8 py-4 mb-4">
              <img src={logo} alt="Nanis logo" className="h-8 w-auto" />
            </div> */}

            <h2 className="text-2xl font-bold text-gray-900">
              Log in to Nanis
            </h2>

            <p className="text-sm text-gray-500 mt-1 text-center">
              Never miss a message, anywhere
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="animate-shake bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                className={`w-full px-4 py-3 border rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`w-full px-4 py-3 border rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {Array.isArray(validationErrors.password) 
                    ? validationErrors.password[0] 
                    : validationErrors.password}
                </p>
              )}
            </div>

            <div className="text-right text-sm">
              <Link
                to="/forgot"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg
                bg-indigo-600 hover:bg-indigo-700 hover:shadow-md
                text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" className="opacity-75"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
