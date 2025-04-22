import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clientService from '../services/clientService';

const initialState = {
  clients: [],
  client: null,
  isLoading: false,
  error: null,
  success: false,
  totalPages: 0,
  currentPage: 1,
  totalClients: 0,
  stats: null
};

// Get all clients
export const getClients = createAsyncThunk(
  'clients/getAll',
  async (params, thunkAPI) => {
    try {
      return await clientService.getClients(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch clients';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get client by ID
export const getClientById = createAsyncThunk(
  'clients/getById',
  async (id, thunkAPI) => {
    try {
      return await clientService.getClientById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch client';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new client
export const createClient = createAsyncThunk(
  'clients/create',
  async (clientData, thunkAPI) => {
    try {
      return await clientService.createClient(clientData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create client';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update client
export const updateClient = createAsyncThunk(
  'clients/update',
  async ({ id, clientData }, thunkAPI) => {
    try {
      return await clientService.updateClient(id, clientData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update client';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete client
export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id, thunkAPI) => {
    try {
      return await clientService.deleteClient(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete client';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get client statistics
export const getClientStats = createAsyncThunk(
  'clients/getStats',
  async (_, thunkAPI) => {
    try {
      return await clientService.getClientStats();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch client statistics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearClient: (state) => {
      state.client = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all clients
      .addCase(getClients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalClients = action.payload.total;
      })
      .addCase(getClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get client by ID
      .addCase(getClientById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.client = action.payload.data;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create client
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.clients.push(action.payload.data);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update client
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.client = action.payload.data;
        state.clients = state.clients.map(client => 
          client._id === action.payload.data._id ? action.payload.data : client
        );
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.clients = state.clients.filter(client => client._id !== action.payload.id);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get client statistics
      .addCase(getClientStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClientStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(getClientStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { reset, clearClient } = clientSlice.actions;
export default clientSlice.reducer;
