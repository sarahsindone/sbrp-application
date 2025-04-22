import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataCollectionService from '../services/dataCollectionService';

const initialState = {
  dataCollections: [],
  dataCollection: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null
};

// Create new data collection
export const createDataCollection = createAsyncThunk(
  'dataCollection/create',
  async (dataCollectionData, thunkAPI) => {
    try {
      return await dataCollectionService.createDataCollection(dataCollectionData);
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

// Get all data collections
export const getDataCollections = createAsyncThunk(
  'dataCollection/getAll',
  async (params, thunkAPI) => {
    try {
      return await dataCollectionService.getDataCollections(params);
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

// Get data collection by ID
export const getDataCollectionById = createAsyncThunk(
  'dataCollection/getById',
  async (id, thunkAPI) => {
    try {
      return await dataCollectionService.getDataCollectionById(id);
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

// Get data collection by case ID
export const getDataCollectionByCaseId = createAsyncThunk(
  'dataCollection/getByCaseId',
  async (caseId, thunkAPI) => {
    try {
      return await dataCollectionService.getDataCollectionByCaseId(caseId);
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

// Update data collection
export const updateDataCollection = createAsyncThunk(
  'dataCollection/update',
  async ({ id, dataCollectionData }, thunkAPI) => {
    try {
      return await dataCollectionService.updateDataCollection(id, dataCollectionData);
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

// Update data collection section
export const updateDataCollectionSection = createAsyncThunk(
  'dataCollection/updateSection',
  async ({ id, section, sectionData }, thunkAPI) => {
    try {
      return await dataCollectionService.updateDataCollectionSection(id, section, sectionData);
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

// Complete data collection
export const completeDataCollection = createAsyncThunk(
  'dataCollection/complete',
  async (id, thunkAPI) => {
    try {
      return await dataCollectionService.completeDataCollection(id);
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

// Delete data collection
export const deleteDataCollection = createAsyncThunk(
  'dataCollection/delete',
  async (id, thunkAPI) => {
    try {
      await dataCollectionService.deleteDataCollection(id);
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

export const dataCollectionSlice = createSlice({
  name: 'dataCollection',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    clearDataCollection: (state) => {
      state.dataCollection = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create data collection
      .addCase(createDataCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDataCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollections.push(action.payload.data);
        state.dataCollection = action.payload.data;
      })
      .addCase(createDataCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get all data collections
      .addCase(getDataCollections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollections = action.payload.data;
      })
      .addCase(getDataCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get data collection by ID
      .addCase(getDataCollectionById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataCollectionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollection = action.payload.data;
      })
      .addCase(getDataCollectionById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get data collection by case ID
      .addCase(getDataCollectionByCaseId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataCollectionByCaseId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollection = action.payload.data;
      })
      .addCase(getDataCollectionByCaseId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update data collection
      .addCase(updateDataCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDataCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollection = action.payload.data;
        state.dataCollections = state.dataCollections.map(dataCollection => 
          dataCollection._id === action.payload.data._id ? action.payload.data : dataCollection
        );
      })
      .addCase(updateDataCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update data collection section
      .addCase(updateDataCollectionSection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDataCollectionSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollection = action.payload.data;
        state.dataCollections = state.dataCollections.map(dataCollection => 
          dataCollection._id === action.payload.data._id ? action.payload.data : dataCollection
        );
      })
      .addCase(updateDataCollectionSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Complete data collection
      .addCase(completeDataCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeDataCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollection = action.payload.data;
        state.dataCollections = state.dataCollections.map(dataCollection => 
          dataCollection._id === action.payload.data._id ? action.payload.data : dataCollection
        );
      })
      .addCase(completeDataCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Delete data collection
      .addCase(deleteDataCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDataCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dataCollections = state.dataCollections.filter(
          dataCollection => dataCollection._id !== action.payload
        );
        state.dataCollection = null;
      })
      .addCase(deleteDataCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  }
});

export const { reset, clearDataCollection } = dataCollectionSlice.actions;
export default dataCollectionSlice.reducer;
