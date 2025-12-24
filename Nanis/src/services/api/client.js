import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true, // Important for Sanctum CSRF cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - attach token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - clear auth state
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data.message);
      }
      
      // Handle 422 Validation errors
      if (error.response.status === 422) {
        console.error('Validation errors:', error.response.data.errors);
      }
      
      // Handle 500 Server errors
      if (error.response.status === 500) {
        console.error('Server error:', error.response.data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
