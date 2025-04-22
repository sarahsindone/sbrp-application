import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import caseService from '../services/caseService';

const initialState = {
  cases: [],
  case: null,
  isLoading: false,
  error: null,
  success: false,
  totalPages: 0,
  currentPage: 1,
  totalCases: 0,
  stats: null
};

// Get all cases
export const getCases = createAsyncThunk(
  'cases/getAll',
  async (params, thunkAPI) => {
    try {
      return await caseService.getCases(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch cases';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get case by ID
export const getCaseById = createAsyncThunk(
  'cases/getById',
  async (id, thunkAPI) => {
    try {
      return await caseService.getCaseById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch case';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new case
export const createCase = createAsyncThunk(
  'cases/create',
  async (caseData, thunkAPI) => {
    try {
      return await caseService.createCase(caseData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create case';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update case
export const updateCase = createAsyncThunk(
  'cases/update',
  async ({ id, caseData }, thunkAPI) => {
    try {
      return await caseService.updateCase(id, caseData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update case';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update case status
export const updateCaseStatus = createAsyncThunk(
  'cases/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      return await caseService.updateCaseStatus(id, status);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update case status';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete case
export const deleteCase = createAsyncThunk(
  'cases/delete',
  async (id, thunkAPI) => {
    try {
      return await caseService.deleteCase(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete case';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get case statistics
export const getCaseStats = createAsyncThunk(
  'cases/getStats',
  async (_, thunkAPI) => {
    try {
      return await caseService.getCaseStats();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch case statistics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const caseSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearCase: (state) => {
      state.case = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all cases
      .addCase(getCases.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cases = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCases = action.payload.total;
      })
      .addCase(getCases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get case by ID
      .addCase(getCaseById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCaseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.case = action.payload.data;
      })
      .addCase(getCaseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create case
      .addCase(createCase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.cases.push(action.payload.data);
      })
      .addCase(createCase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update case
      .addCase(updateCase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.case = action.payload.data;
        state.cases = state.cases.map(caseItem => 
          caseItem._id === action.payload.data._id ? action.payload.data : caseItem
        );
      })
      .addCase(updateCase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update case status
      .addCase(updateCaseStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCaseStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.case = action.payload.data;
        state.cases = state.cases.map(caseItem => 
          caseItem._id === action.payload.data._id ? action.payload.data : caseItem
        );
      })
      .addCase(updateCaseStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete case
      .addCase(deleteCase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.cases = state.cases.filter(caseItem => caseItem._id !== action.payload.id);
      })
      .addCase(deleteCase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get case statistics
      .addCase(getCaseStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCaseStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(getCaseStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { reset, clearCase } = caseSlice.actions;
export default caseSlice.reducer;
