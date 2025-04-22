import api from '../utils/api';

// Register user
const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/users/login', userData);
  
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await api.post('/users/change-password', passwordData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword
};

export default authService;
