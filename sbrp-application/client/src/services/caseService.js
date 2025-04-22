import api from '../utils/api';

// Get all cases
const getCases = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add query parameters if provided
  if (params.status) queryParams.append('status', params.status);
  if (params.clientId) queryParams.append('clientId', params.clientId);
  if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const response = await api.get(`/cases?${queryParams.toString()}`);
  return response.data;
};

// Get case by ID
const getCaseById = async (id) => {
  const response = await api.get(`/cases/${id}`);
  return response.data;
};

// Create new case
const createCase = async (caseData) => {
  const response = await api.post('/cases', caseData);
  return response.data;
};

// Update case
const updateCase = async (id, caseData) => {
  const response = await api.put(`/cases/${id}`, caseData);
  return response.data;
};

// Update case status
const updateCaseStatus = async (id, status) => {
  const response = await api.patch(`/cases/${id}/status`, { status });
  return response.data;
};

// Delete case
const deleteCase = async (id) => {
  const response = await api.delete(`/cases/${id}`);
  return { ...response.data, id };
};

// Get case statistics
const getCaseStats = async () => {
  const response = await api.get('/cases/stats');
  return response.data;
};

const caseService = {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  updateCaseStatus,
  deleteCase,
  getCaseStats
};

export default caseService;
