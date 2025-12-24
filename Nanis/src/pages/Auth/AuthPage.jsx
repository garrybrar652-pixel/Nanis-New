import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '/assets/icons/logo.svg';

const AuthPage = () => {
  const location = useLocation();
  const initialTab = location.state?.mode || 'login';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    // Clear validation error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: null
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginData.email, loginData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    const result = await register(
      registerData.name,
      registerData.email,
      registerData.password,
      registerData.password_confirmation
    );

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      if (result.errors) {
        setValidationErrors(result.errors);
      }
    }

    setLoading(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full">
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <div className="flex justify-center">
            <img src={logo} alt="Nanis logo" className="h-10 w-auto" />
          </div>
          <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">
            {activeTab === 'login' ? 'Sign In' : 'Create your Nanis account'}
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">Never miss a message, anywhere</p>

          {/* Tab Buttons */}
          <div className="mt-6 flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => switchTab('login')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
                activeTab === 'login'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab('register')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form className="mt-6" onSubmit={handleLoginSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>

              <div className="mt-4">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Submit'}
                </button>
              </div>

              <div className="mt-3 text-sm text-left">
                <Link to="/forgot" className="text-indigo-600 hover:underline">Forgot password?</Link>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form className="mt-6" onSubmit={handleRegisterSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${validationErrors.name ? 'border-red-300' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm`}
                  placeholder="Enter your full name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name[0]}</p>
                )}
              </div>

              <div className="mt-4">
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm`}
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email[0]}</p>
                )}
              </div>

              <div className="mt-4">
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm`}
                  placeholder="Enter your password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-sm text-red-600">{validationErrors.password[0]}</p>
                )}
              </div>

              <div className="mt-4">
                <input
                  id="register-password-confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Confirm your password"
                  value={registerData.password_confirmation}
                  onChange={handleRegisterChange}
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
