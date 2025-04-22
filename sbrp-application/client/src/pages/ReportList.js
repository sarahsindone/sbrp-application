import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReports, generateReport, deleteReport } from '../features/reportSlice';
import { getCases } from '../features/caseSlice';
import { getReportTemplates } from '../features/reportSlice';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PictureAsPdf,
  FilterList
} from '@mui/icons-material';

const ReportList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { reports, templates, isLoading, error } = useSelector((state) => state.report);
  const { cases } = useSelector((state) => state.cases);
  
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReportData, setNewReportData] = useState({
    caseId: '',
    templateId: '',
    title: ''
  });
  const [filterStatus, setFilterStatus] = useState('');
  
  useEffect(() => {
    dispatch(getReports());
    dispatch(getCases());
    dispatch(getReportTemplates());
  }, [dispatch]);
  
  const handleGenerateReport = async () => {
    try {
      const result = await dispatch(generateReport(newReportData)).unwrap();
      setOpenGenerateDialog(false);
      navigate(`/reports/${result.data._id}`);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };
  
  const handleDeleteReport = async () => {
    if (!selectedReport) return;
    
    try {
      await dispatch(deleteReport(selectedReport._id)).unwrap();
      setOpenDeleteDialog(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };
  
  const handleOpenGenerateDialog = () => {
    setNewReportData({
      caseId: '',
      templateId: '',
      title: ''
    });
    setOpenGenerateDialog(true);
  };
  
  const handleOpenDeleteDialog = (report) => {
    setSelectedReport(report);
    setOpenDeleteDialog(true);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'warning';
      case 'review':
        return 'info';
      case 'final':
        return 'primary';
      case 'published':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'review':
        return 'In Review';
      case 'final':
        return 'Final';
      case 'published':
        return 'Published';
      default:
        return status;
    }
  };
  
  const filteredReports = filterStatus 
    ? reports.filter(report => report.status === filterStatus)
    : reports;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenGenerateDialog}
        >
          Generate New Report
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ mr: 2 }}>Filter:</Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="review">In Review</MenuItem>
              <MenuItem value="final">Final</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Case Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No reports found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>
                      {report.clientId && typeof report.clientId === 'object' 
                        ? report.clientId.companyName 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {report.caseId && typeof report.caseId === 'object'
                        ? report.caseId.caseNumber
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(report.status)} 
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {report.metadata?.reportDate 
                        ? new Date(report.metadata.reportDate).toLocaleDateString() 
                        : new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View/Edit">
                        <IconButton 
                          color="primary"
                          onClick={() => navigate(`/reports/${report._id}`)}
                        >
                          {report.status === 'published' ? <Visibility /> : <Edit />}
                        </IconButton>
                      </Tooltip>
                      
                      {report.status === 'published' && report.generatedPdfUrl && (
                        <Tooltip title="View PDF">
                          <IconButton 
                            color="primary"
                            href={report.generatedPdfUrl}
                            target="_blank"
                          >
                            <PictureAsPdf />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {report.status !== 'published' && (
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error"
                            onClick={() => handleOpenDeleteDialog(report)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Generate Report Dialog */}
      <Dialog
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select a case and template to generate a new report.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Case</InputLabel>
            <Select
              value={newReportData.caseId}
              label="Case"
              onChange={(e) => setNewReportData({ ...newReportData, caseId: e.target.value })}
            >
              {cases.map((caseItem) => (
                <MenuItem key={caseItem._id} value={caseItem._id}>
                  {caseItem.caseNumber} - {caseItem.clientId && typeof caseItem.clientId === 'object' 
                    ? caseItem.clientId.companyName 
                    : 'Unknown Client'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Template</InputLabel>
            <Select
              value={newReportData.templateId}
              label="Template"
              onChange={(e) => setNewReportData({ ...newReportData, templateId: e.target.value })}
            >
              <MenuItem value="">Default Template</MenuItem>
              {templates.map((template) => (
                <MenuItem key={template._id} value={template._id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Report Title"
            value={newReportData.title}
            onChange={(e) => setNewReportData({ ...newReportData, title: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGenerateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGenerateReport} 
            variant="contained" 
            color="primary"
            disabled={!newReportData.caseId}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Report Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteReport} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportList;
