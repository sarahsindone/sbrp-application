import api from '../utils/api';

// Get all clients
const getClients = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add query parameters if provided
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const response = await api.get(`/clients?${queryParams.toString()}`);
  return response.data;
};

// Get client by ID
const getClientById = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

// Create new client
const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

// Update client
const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

// Delete client
const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return { ...response.data, id };
};

// Get client statistics
const getClientStats = async () => {
  const response = await api.get('/clients/stats');
  return response.data;
};

const clientService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStats
};

export default clientService;
