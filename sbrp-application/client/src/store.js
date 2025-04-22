import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import clientReducer from './features/clientSlice';
import caseReducer from './features/caseSlice';
import dataCollectionReducer from './features/dataCollectionSlice';
import reportReducer from './features/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    cases: caseReducer,
    dataCollection: dataCollectionReducer,
    report: reportReducer
  },
});
