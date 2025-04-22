import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getClientById, clearClient } from '../features/clientSlice';
import { getCases } from '../features/caseSlice';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Business,
  Edit,
  Assignment,
  Phone,
  Email,
  Language,
  LocationOn,
  Person,
  AttachMoney,
  Description,
  Comment,
  CheckCircle,
  Add as AddIcon
} from '@mui/icons-material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { client, isLoading: clientLoading, error: clientError } = useSelector((state) => state.clients);
  const { cases, isLoading: casesLoading } = useSelector((state) => state.cases);
  const [tabValue, setTabValue] = useState(0);
  const [clientCases, setClientCases] = useState([]);

  useEffect(() => {
    dispatch(getClientById(id));
    dispatch(getCases({ clientId: id }));

    return () => {
      dispatch(clearClient());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (cases && cases.length > 0) {
      setClientCases(cases);
    }
  }, [cases]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'archived':
        return 'default';
      default:
        return 'primary';
    }
  };

  const getCaseStatusColor = (status) => {
    switch (status) {
      case 'data-collection':
        return 'warning';
      case 'analysis':
        return 'info';
      case 'plan-development':
        return 'primary';
      case 'report-generation':
        return 'secondary';
      case 'creditor-voting':
        return 'warning';
      case 'implementation':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  if (clientLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (clientError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {clientError}
      </Alert>
    );
  }

  if (!client) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Client not found
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {client.companyName}
          </Typography>
          {client.tradingName && (
            <Typography variant="subtitle1" color="textSecondary">
              Trading as: {client.tradingName}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={client.status.charAt(0).toUpperCase() + client.status.slice(1)} 
              color={getStatusColor(client.status)}
              sx={{ mr: 1 }}
            />
            {client.businessType && (
              <Chip 
                label={client.businessType} 
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/clients/${client._id}/edit`)}
        >
          Edit Client
        </Button>
      </Box>

      {/* Client Details and Tabs */}
      <Grid container spacing={3}>
        {/* Left Column - Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Client Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List disablePadding>
                {client.acn && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Business fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="ACN" 
                      secondary={client.acn} 
                      primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                
                {client.abn && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Business fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="ABN" 
                      secondary={client.abn} 
                      primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                
                {client.incorporationDate && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Business fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Incorporation Date" 
                      secondary={new Date(client.incorporationDate).toLocaleDateString()} 
                      primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                
                {client.contactDetails?.phone && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Phone fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={client.contactDetails.phone} 
                      primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                
                {client.contactDetails?.email && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Email fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={client.contactDetails.email} 
                      primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                
                {client.contactDetails?.website && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Language fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Website" 
                      secondary={client.contactDetails.website} 
                      primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                
                {client.contactDetails?.address && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LocationOn fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address" 
                      secondary={client.contactDetails.address} 
                      primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
              </List>
              
              {client.directors && client.directors.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Directors
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {client.directors.map((director, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        {director.name}
                        {director.position && ` - ${director.position}`}
                      </Typography>
                      
                      {director.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{director.phone}</Typography>
                        </Box>
                      )}
                      
                      {director.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{director.email}</Typography>
                        </Box>
                      )}
                      
                      {director.background && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          {director.background}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Tabs */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Overview" icon={<Business />} iconPosition="start" />
              <Tab label="Cases" icon={<Assignment />} iconPosition="start" />
              <Tab label="Communications" icon={<Comment />} iconPosition="start" />
              <Tab label="Documents" icon={<Description />} iconPosition="start" />
              <Tab label="Tasks" icon={<CheckCircle />} iconPosition="start" />
              <Tab label="Notes" icon={<Comment />} iconPosition="start" />
            </Tabs>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Business Description
                  </Typography>
                  <Typography variant="body1">
                    {client.businessDescription || 'No business description provided.'}
                  </Typography>
                </Grid>

                {client.operatingRegion && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Operating Region
                      </Typography>
                      <Typography variant="body1">
                        {client.operatingRegion}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {client.businessOperations?.employeeCount !== undefined && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Employee Count
                      </Typography>
                      <Typography variant="body1">
                        {client.businessOperations.employeeCount}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {client.businessOperations?.annualRevenue !== undefined && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Annual Revenue
                      </Typography>
                      <Typography variant="body1">
                        ${client.businessOperations.annualRevenue.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {client.financialStatus?.currentDebtAmount !== undefined && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Current Debt Amount
                      </Typography>
                      <Typography variant="body1">
                        ${client.financialStatus.currentDebtAmount.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {client.financialStatus?.atoDebtAmount !== undefined && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        ATO Debt Amount
                      </Typography>
                      <Typography variant="body1">
                        ${client.financialStatus.atoDebtAmount.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {client.financialStatus?.difficultiesStartDate && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Financial Difficulties Start Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(client.financialStatus.difficultiesStartDate).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {client.businessOperations?.majorAssets && (
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Major Assets
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {client.businessOperations.majorAssets}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                {client.businessOperations?.majorLiabilities && (
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Major Liabilities
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {client.businessOperations.majorLiabilities}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            {/* Cases Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  SBRP Cases
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/cases/new', { state: { clientId: client._id } })}
                >
                  New Case
                </Button>
              </Box>
              
              {casesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : clientCases && clientCases.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Case Number</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Appointment Date</TableCell>
                        <TableCell>Primary Contact</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientCases.map((caseItem) => (
                        <TableRow key={caseItem._id} hover>
                          <TableCell>{caseItem.caseNumber}</TableCell>
                          <TableCell>
                            <Chip 
                              label={caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1).replace(/-/g, ' ')} 
                              color={getCaseStatusColor(caseItem.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(caseItem.appointmentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {caseItem.primaryContact?.firstName} {caseItem.primaryContact?.lastName}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/cases/${caseItem._id}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No cases found for this client
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/cases/new', { state: { clientId: client._id } })}
                    sx={{ mt: 1 }}
                  >
                    Create First Case
                  </Button>
                </Paper>
              )}
            </TabPanel>

            {/* Communications Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Communications
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  New Communication
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Communications module will be implemented in the next phase
                </Typography>
              </Paper>
            </TabPanel>

            {/* Documents Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Documents
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Upload Document
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Documents module will be implemented in the next phase
                </Typography>
              </Paper>
            </TabPanel>

            {/* Tasks Tab */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Tasks
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  New Task
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Tasks module will be implemented in the next phase
                </Typography>
              </Paper>
            </TabPanel>

            {/* Notes Tab */}
            <TabPanel value={tabValue} index={5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Notes
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add Note
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Notes module will be implemented in the next phase
                </Typography>
              </Paper>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDetails;
