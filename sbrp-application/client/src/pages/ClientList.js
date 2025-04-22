import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClients, reset } from '../features/clientSlice';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const ClientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients, isLoading, error, totalPages, currentPage, totalClients } = useSelector((state) => state.clients);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('date_desc');

  useEffect(() => {
    loadClients();
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, page, rowsPerPage, statusFilter, sortOption]);

  const loadClients = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      sort: sortOption
    };
    
    if (statusFilter) {
      params.status = statusFilter;
    }
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    dispatch(getClients(params));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setPage(0);
    loadClients();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
    loadClients();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/clients/new')}
        >
          Add New Client
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Clients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm && (
                      <IconButton onClick={handleClearSearch} edge="end">
                        <ClearIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={handleSearch} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="name_asc">Company Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Company Name (Z-A)</MenuItem>
                <MenuItem value="date_asc">Date Added (Oldest)</MenuItem>
                <MenuItem value="date_desc">Date Added (Newest)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Client Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Trading Name</TableCell>
                <TableCell>ACN/ABN</TableCell>
                <TableCell>Business Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : clients && clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {client.companyName}
                      </Box>
                    </TableCell>
                    <TableCell>{client.tradingName || '-'}</TableCell>
                    <TableCell>
                      {client.acn ? `ACN: ${client.acn}` : ''}
                      {client.acn && client.abn ? <br /> : ''}
                      {client.abn ? `ABN: ${client.abn}` : ''}
                      {!client.acn && !client.abn ? '-' : ''}
                    </TableCell>
                    <TableCell>{client.businessType || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={client.status.charAt(0).toUpperCase() + client.status.slice(1)} 
                        color={getStatusColor(client.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/clients/${client._id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No clients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalClients || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ClientList;
