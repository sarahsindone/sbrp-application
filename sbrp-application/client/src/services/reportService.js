import api from '../utils/api';

// Create new report template
const createReportTemplate = async (templateData) => {
  const response = await api.post('/reports/templates', templateData);
  return response.data;
};

// Get all report templates
const getReportTemplates = async () => {
  const response = await api.get('/reports/templates');
  return response.data;
};

// Get report template by ID
const getReportTemplateById = async (id) => {
  const response = await api.get(`/reports/templates/${id}`);
  return response.data;
};

// Update report template
const updateReportTemplate = async (id, templateData) => {
  const response = await api.put(`/reports/templates/${id}`, templateData);
  return response.data;
};

// Delete report template
const deleteReportTemplate = async (id) => {
  const response = await api.delete(`/reports/templates/${id}`);
  return response.data;
};

// Generate new report
const generateReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

// Get all reports
const getReports = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add query parameters if provided
  if (params.caseId) queryParams.append('caseId', params.caseId);
  if (params.clientId) queryParams.append('clientId', params.clientId);
  if (params.status) queryParams.append('status', params.status);
  
  const response = await api.get(`/reports?${queryParams.toString()}`);
  return response.data;
};

// Get report by ID
const getReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

// Update report
const updateReport = async (id, reportData) => {
  const response = await api.put(`/reports/${id}`, reportData);
  return response.data;
};

// Update report section
const updateReportSection = async (id, sectionIndex, sectionData) => {
  const response = await api.patch(`/reports/${id}/section/${sectionIndex}`, sectionData);
  return response.data;
};

// Set report review status
const setReportReviewStatus = async (id) => {
  const response = await api.patch(`/reports/${id}/review`);
  return response.data;
};

// Finalize report
const finalizeReport = async (id) => {
  const response = await api.patch(`/reports/${id}/finalize`);
  return response.data;
};

// Publish report
const publishReport = async (id, pdfUrl) => {
  const response = await api.patch(`/reports/${id}/publish`, { pdfUrl });
  return response.data;
};

// Delete report
const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

const reportService = {
  createReportTemplate,
  getReportTemplates,
  getReportTemplateById,
  updateReportTemplate,
  deleteReportTemplate,
  generateReport,
  getReports,
  getReportById,
  updateReport,
  updateReportSection,
  setReportReviewStatus,
  finalizeReport,
  publishReport,
  deleteReport
};

export default reportService;
