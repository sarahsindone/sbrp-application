import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';

// Layout and Auth Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Dashboard and Client Management
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetails from './pages/ClientDetails';

// Data Collection
import DataCollection from './pages/DataCollection';

// Report Generation
import ReportList from './pages/ReportList';
import ReportEditor from './pages/ReportEditor';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Client Management Routes */}
              <Route path="clients" element={<ClientList />} />
              <Route path="clients/:id" element={<ClientDetails />} />
              
              {/* Data Collection Routes */}
              <Route path="data-collection/:caseId" element={<DataCollection />} />
              <Route path="data-collection/edit/:id" element={<DataCollection />} />
              
              {/* Report Routes */}
              <Route path="reports" element={<ReportList />} />
              <Route path="reports/:id" element={<ReportEditor />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
