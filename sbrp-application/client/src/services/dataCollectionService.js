import api from '../utils/api';

// Create new data collection
const createDataCollection = async (dataCollectionData) => {
  const response = await api.post('/data-collection', dataCollectionData);
  return response.data;
};

// Get all data collections
const getDataCollections = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add query parameters if provided
  if (params.caseId) queryParams.append('caseId', params.caseId);
  if (params.clientId) queryParams.append('clientId', params.clientId);
  if (params.status) queryParams.append('status', params.status);
  
  const response = await api.get(`/data-collection?${queryParams.toString()}`);
  return response.data;
};

// Get data collection by ID
const getDataCollectionById = async (id) => {
  const response = await api.get(`/data-collection/${id}`);
  return response.data;
};

// Get data collection by case ID
const getDataCollectionByCaseId = async (caseId) => {
  const response = await api.get(`/data-collection/case/${caseId}`);
  return response.data;
};

// Update data collection
const updateDataCollection = async (id, dataCollectionData) => {
  const response = await api.put(`/data-collection/${id}`, dataCollectionData);
  return response.data;
};

// Update data collection section
const updateDataCollectionSection = async (id, section, sectionData) => {
  const response = await api.patch(`/data-collection/${id}/section/${section}`, sectionData);
  return response.data;
};

// Complete data collection
const completeDataCollection = async (id) => {
  const response = await api.patch(`/data-collection/${id}/complete`);
  return response.data;
};

// Delete data collection
const deleteDataCollection = async (id) => {
  const response = await api.delete(`/data-collection/${id}`);
  return response.data;
};

const dataCollectionService = {
  createDataCollection,
  getDataCollections,
  getDataCollectionById,
  getDataCollectionByCaseId,
  updateDataCollection,
  updateDataCollectionSection,
  completeDataCollection,
  deleteDataCollection
};

export default dataCollectionService;
