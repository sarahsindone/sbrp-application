import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../services/reportService';

const initialState = {
  reports: [],
  report: null,
  templates: [],
  template: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null
};

// Create new report template
export const createReportTemplate = createAsyncThunk(
  'report/createTemplate',
  async (templateData, thunkAPI) => {
    try {
      return await reportService.createReportTemplate(templateData);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all report templates
export const getReportTemplates = createAsyncThunk(
  'report/getTemplates',
  async (_, thunkAPI) => {
    try {
      return await reportService.getReportTemplates();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get report template by ID
export const getReportTemplateById = createAsyncThunk(
  'report/getTemplateById',
  async (id, thunkAPI) => {
    try {
      return await reportService.getReportTemplateById(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update report template
export const updateReportTemplate = createAsyncThunk(
  'report/updateTemplate',
  async ({ id, templateData }, thunkAPI) => {
    try {
      return await reportService.updateReportTemplate(id, templateData);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete report template
export const deleteReportTemplate = createAsyncThunk(
  'report/deleteTemplate',
  async (id, thunkAPI) => {
    try {
      await reportService.deleteReportTemplate(id);
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Generate new report
export const generateReport = createAsyncThunk(
  'report/generate',
  async (reportData, thunkAPI) => {
    try {
      return await reportService.generateReport(reportData);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all reports
export const getReports = createAsyncThunk(
  'report/getAll',
  async (params, thunkAPI) => {
    try {
      return await reportService.getReports(params);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get report by ID
export const getReportById = createAsyncThunk(
  'report/getById',
  async (id, thunkAPI) => {
    try {
      return await reportService.getReportById(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update report
export const updateReport = createAsyncThunk(
  'report/update',
  async ({ id, reportData }, thunkAPI) => {
    try {
      return await reportService.updateReport(id, reportData);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update report section
export const updateReportSection = createAsyncThunk(
  'report/updateSection',
  async ({ id, sectionIndex, sectionData }, thunkAPI) => {
    try {
      return await reportService.updateReportSection(id, sectionIndex, sectionData);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Set report review status
export const setReportReviewStatus = createAsyncThunk(
  'report/setReviewStatus',
  async (id, thunkAPI) => {
    try {
      return await reportService.setReportReviewStatus(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Finalize report
export const finalizeReport = createAsyncThunk(
  'report/finalize',
  async (id, thunkAPI) => {
    try {
      return await reportService.finalizeReport(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Publish report
export const publishReport = createAsyncThunk(
  'report/publish',
  async ({ id, pdfUrl }, thunkAPI) => {
    try {
      return await reportService.publishReport(id, pdfUrl);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete report
export const deleteReport = createAsyncThunk(
  'report/delete',
  async (id, thunkAPI) => {
    try {
      await reportService.deleteReport(id);
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    clearReport: (state) => {
      state.report = null;
    },
    clearTemplate: (state) => {
      state.template = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create report template
      .addCase(createReportTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReportTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates.push(action.payload.data);
        state.template = action.payload.data;
      })
      .addCase(createReportTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get all report templates
      .addCase(getReportTemplates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReportTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = action.payload.data;
      })
      .addCase(getReportTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get report template by ID
      .addCase(getReportTemplateById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReportTemplateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.template = action.payload.data;
      })
      .addCase(getReportTemplateById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update report template
      .addCase(updateReportTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReportTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.template = action.payload.data;
        state.templates = state.templates.map(template => 
          template._id === action.payload.data._id ? action.payload.data : template
        );
      })
      .addCase(updateReportTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Delete report template
      .addCase(deleteReportTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReportTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = state.templates.filter(
          template => template._id !== action.payload
        );
        state.template = null;
      })
      .addCase(deleteReportTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Generate report
      .addCase(generateReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports.push(action.payload.data);
        state.report = action.payload.data;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get all reports
      .addCase(getReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = action.payload.data;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get report by ID
      .addCase(getReportById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReportById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload.data;
      })
      .addCase(getReportById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update report
      .addCase(updateReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload.data;
        state.reports = state.reports.map(report => 
          report._id === action.payload.data._id ? action.payload.data : report
        );
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update report section
      .addCase(updateReportSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReportSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload.data;
        state.reports = state.reports.map(report => 
          report._id === action.payload.data._id ? action.payload.data : report
        );
      })
      .addCase(updateReportSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Set report review status
      .addCase(setReportReviewStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setReportReviewStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload.data;
        state.reports = state.reports.map(report => 
          report._id === action.payload.data._id ? action.payload.data : report
        );
      })
      .addCase(setReportReviewStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Finalize report
      .addCase(finalizeReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(finalizeReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload.data;
        state.reports = state.reports.map(report => 
          report._id === action.payload.data._id ? action.payload.data : report
        );
      })
      .addCase(finalizeReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Publish report
      .addCase(publishReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(publishReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload.data;
        state.reports = state.reports.map(report => 
          report._id === action.payload.data._id ? action.payload.data : report
        );
      })
      .addCase(publishReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Delete report
      .addCase(deleteReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = state.reports.filter(
          report => report._id !== action.payload
        );
        state.report = null;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  }
});

export const { reset, clearReport, clearTemplate } = reportSlice.actions;
export default reportSlice.reducer;
