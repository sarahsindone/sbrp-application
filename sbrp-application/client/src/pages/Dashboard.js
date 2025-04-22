import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClients, getClientStats } from '../features/clientSlice';
import { getCaseStats } from '../features/caseSlice';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Button,
  Alert
} from '@mui/material';
import {
  Business,
  Assignment,
  People,
  AttachMoney,
  Timeline,
  CheckCircle,
  Warning,
  HourglassEmpty
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { clients, stats: clientStats, isLoading: clientsLoading, error: clientsError } = useSelector((state) => state.clients);
  const { cases, stats: caseStats, isLoading: casesLoading, error: casesError } = useSelector((state) => state.cases);
  const [recentClients, setRecentClients] = useState([]);
  const [recentCases, setRecentCases] = useState([]);

  useEffect(() => {
    dispatch(getClients({ limit: 5, sort: 'date_desc' }));
    dispatch(getClientStats());
    dispatch(getCaseStats());
  }, [dispatch]);

  useEffect(() => {
    if (clients && clients.length > 0) {
      setRecentClients(clients.slice(0, 5));
    }
  }, [clients]);

  useEffect(() => {
    if (cases && cases.length > 0) {
      setRecentCases(cases.slice(0, 5));
    }
  }, [cases]);

  const isLoading = clientsLoading || casesLoading;
  const hasError = clientsError || casesError;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {clientsError || casesError}
      </Alert>
    );
  }

  // Prepare data for charts
  const caseStatusData = caseStats?.casesByStatus?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1).replace(/-/g, ' '),
    value: item.count
  })) || [];

  const clientTypeData = clientStats?.clientsByType?.map(item => ({
    name: item._id || 'Unspecified',
    value: item.count
  })) || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Welcome back, {user?.firstName || 'User'}! Here's an overview of your SBRP activities.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Business />
                </Avatar>
                <Typography variant="h6">Active Clients</Typography>
              </Box>
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {clientStats?.activeClients || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Total clients: {clientStats?.totalClients || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Typography variant="h6">Active Cases</Typography>
              </Box>
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {caseStats?.casesByStatus?.find(s => s._id !== 'completed')?.count || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Total cases: {caseStats?.totalCases || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h6">Completed</Typography>
              </Box>
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {caseStats?.casesByStatus?.find(s => s._id === 'completed')?.count || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Successfully restructured
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <HourglassEmpty />
                </Avatar>
                <Typography variant="h6">Pending</Typography>
              </Box>
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {caseStats?.casesByStatus?.find(s => s._id === 'data-collection' || s._id === 'analysis')?.count || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Awaiting action
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Case Status Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Cases by Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={caseStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Client Type Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Clients by Business Type
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2c3e50" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Clients */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Clients
              </Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/clients')}>
                View All
              </Button>
            </Box>
            <Divider />
            <List>
              {recentClients.length > 0 ? (
                recentClients.map((client) => (
                  <ListItem
                    key={client._id}
                    button
                    onClick={() => navigate(`/clients/${client._id}`)}
                    divider
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <Business />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={client.companyName}
                      secondary={client.tradingName || client.businessType || 'No additional info'}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No clients found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Cases */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Cases
              </Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/cases')}>
                View All
              </Button>
            </Box>
            <Divider />
            <List>
              {recentCases.length > 0 ? (
                recentCases.map((caseItem) => (
                  <ListItem
                    key={caseItem._id}
                    button
                    onClick={() => navigate(`/cases/${caseItem._id}`)}
                    divider
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.light' }}>
                        <Assignment />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={caseItem.caseNumber}
                      secondary={`Status: ${caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1).replace(/-/g, ' ')}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No cases found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
