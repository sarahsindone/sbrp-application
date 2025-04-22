import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReportById, updateReportSection, setReportReviewStatus, finalizeReport, publishReport } from '../features/reportSlice';
import { getClientById } from '../features/clientSlice';
import { getCaseById } from '../features/caseSlice';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Edit,
  Save,
  Preview,
  Check,
  PictureAsPdf,
  Send,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ReportEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { report, isLoading: reportLoading, error: reportError } = useSelector((state) => state.report);
  const { client } = useSelector((state) => state.clients);
  const { case: caseData } = useSelector((state) => state.cases);
  
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionContent, setSectionContent] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState(false);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  
  useEffect(() => {
    dispatch(getReportById(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (report) {
      if (report.clientId && typeof report.clientId === 'string') {
        dispatch(getClientById(report.clientId));
      } else if (report.clientId && report.clientId._id) {
        dispatch(getClientById(report.clientId._id));
      }
      
      if (report.caseId && typeof report.caseId === 'string') {
        dispatch(getCaseById(report.caseId));
      } else if (report.caseId && report.caseId._id) {
        dispatch(getCaseById(report.caseId._id));
      }
      
      if (report.sections && report.sections.length > 0) {
        setSectionContent(report.sections[currentSection]?.content || '');
        setSectionTitle(report.sections[currentSection]?.title || '');
      }
    }
  }, [dispatch, report, currentSection]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSectionChange = (index) => {
    // Save current section if in edit mode
    if (editMode) {
      handleSaveSection();
    }
    
    setCurrentSection(index);
    if (report && report.sections && report.sections[index]) {
      setSectionContent(report.sections[index].content || '');
      setSectionTitle(report.sections[index].title || '');
    }
  };
  
  const handleEditToggle = () => {
    setEditMode(!editMode);
  };
  
  const handleSaveSection = async () => {
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      const sectionData = {
        title: sectionTitle,
        content: sectionContent
      };
      
      await dispatch(updateReportSection({ 
        id, 
        sectionIndex: currentSection, 
        sectionData 
      })).unwrap();
      
      setSaveSuccess(true);
      setEditMode(false);
    } catch (error) {
      setSaveError('Failed to save section. Please try again.');
    }
  };
  
  const handleReviewRequest = async () => {
    try {
      await dispatch(setReportReviewStatus(id)).unwrap();
      setOpenReviewDialog(false);
    } catch (error) {
      setSaveError('Failed to submit for review. Please try again.');
    }
  };
  
  const handleFinalize = async () => {
    try {
      await dispatch(finalizeReport(id)).unwrap();
      setOpenFinalizeDialog(false);
    } catch (error) {
      setSaveError('Failed to finalize report. Please try again.');
    }
  };
  
  const handlePublish = async () => {
    try {
      // In a real implementation, we would generate a PDF and get its URL
      const pdfUrl = `/reports/${id}/pdf`;
      await dispatch(publishReport({ id, pdfUrl })).unwrap();
      setOpenPublishDialog(false);
    } catch (error) {
      setSaveError('Failed to publish report. Please try again.');
    }
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
  
  if (reportLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (reportError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {reportError}
      </Alert>
    );
  }
  
  if (!report) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Report not found
      </Alert>
    );
  }
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {report.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mr: 2 }}>
              Status:
            </Typography>
            <Chip 
              label={getStatusLabel(report.status)} 
              color={getStatusColor(report.status)}
            />
          </Box>
          <Typography variant="subtitle1" color="textSecondary">
            {client?.companyName} - Case: {caseData?.caseNumber || report.caseId}
          </Typography>
        </Box>
        <Box>
          {report.status === 'draft' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Preview />}
              onClick={() => setOpenReviewDialog(true)}
              sx={{ mr: 1 }}
            >
              Submit for Review
            </Button>
          )}
          
          {report.status === 'review' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Check />}
              onClick={() => setOpenFinalizeDialog(true)}
              sx={{ mr: 1 }}
            >
              Finalize
            </Button>
          )}
          
          {report.status === 'final' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<PictureAsPdf />}
              onClick={() => setOpenPublishDialog(true)}
              sx={{ mr: 1 }}
            >
              Publish
            </Button>
          )}
          
          {report.status === 'published' && report.generatedPdfUrl && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              href={report.generatedPdfUrl}
              target="_blank"
              sx={{ mr: 1 }}
            >
              View PDF
            </Button>
          )}
          
          <Button
            variant="outlined"
            onClick={() => navigate('/reports')}
          >
            Back to Reports
          </Button>
        </Box>
      </Box>
      
      {/* Report Metadata */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">Report Number</Typography>
            <Typography variant="body1">{report.metadata?.reportNumber || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">Report Date</Typography>
            <Typography variant="body1">
              {report.metadata?.reportDate ? new Date(report.metadata.reportDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">Version</Typography>
            <Typography variant="body1">{report.metadata?.version || '1'}</Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs and Content */}
      <Paper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Edit Report" />
          <Tab label="Preview" />
          <Tab label="History" />
        </Tabs>
        
        {/* Edit Report Tab */}
        <Box sx={{ p: 0 }} hidden={activeTab !== 0}>
          <Box sx={{ display: 'flex', height: 'calc(100vh - 300px)' }}>
            {/* Section Navigation */}
            <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', p: 2, overflowY: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Sections
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {report.sections && report.sections.map((section, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 1.5, 
                    mb: 1, 
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: currentSection === index ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: currentSection === index ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  onClick={() => handleSectionChange(index)}
                >
                  <Typography variant="subtitle2">
                    {index + 1}. {section.title || `Section ${index + 1}`}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {/* Section Editor */}
            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
              {saveSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Section saved successfully!
                </Alert>
              )}
              
              {saveError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {saveError}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {editMode ? 'Editing: ' : ''}
                  {report.sections[currentSection]?.title || `Section ${currentSection + 1}`}
                </Typography>
                
                <Box>
                  {editMode ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleSaveSection}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEditToggle}
                      disabled={report.status === 'published'}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={currentSection > 0 ? <ArrowBack /> : <ArrowForward />}
                    onClick={() => {
                      if (currentSection > 0) {
                        handleSectionChange(currentSection - 1);
                      } else if (currentSection < report.sections.length - 1) {
                        handleSectionChange(currentSection + 1);
                      }
                    }}
                    disabled={
                      (currentSection === 0 && currentSection === report.sections.length - 1) ||
                      (currentSection === 0 && !report.sections[currentSection + 1])
                    }
                  >
                    {currentSection > 0 ? 'Previous' : 'Next'}
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {editMode ? (
                <>
                  <TextField
                    fullWidth
                    label="Section Title"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <ReactQuill
                    theme="snow"
                    value={sectionContent}
                    onChange={setSectionContent}
                    style={{ height: 'calc(100vh - 450px)', marginBottom: '50px' }}
                  />
                </>
              ) : (
                <Box>
                  <div dangerouslySetInnerHTML={{ __html: sectionContent }} />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        
        {/* Preview Tab */}
        <Box sx={{ p: 3 }} hidden={activeTab !== 1}>
          <Paper variant="outlined" sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
              {report.title}
            </Typography>
            
            <Typography variant="subtitle1" align="center" gutterBottom>
              Prepared for {client?.companyName}
            </Typography>
            
            <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
              Report Number: {report.metadata?.reportNumber || 'N/A'}
            </Typography>
            
            <Typography variant="body2" align="center" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
              Date: {report.metadata?.reportDate ? new Date(report.metadata.reportDate).toLocaleDateString() : 'N/A'}
            </Typography>
            
            <Divider sx={{ mb: 4 }} />
            
            {report.sections && report.sections.map((section, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  {section.title || `Section ${index + 1}`}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                </Box>
                
                {index < report.sections.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            ))}
          </Paper>
        </Box>
        
        {/* History Tab */}
        <Box sx={{ p: 3 }} hidden={activeTab !== 2}>
          <Typography variant="h6" gutterBottom>
            Report History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stepper activeStep={
            report.status === 'published' ? 3 :
            report.status === 'final' ? 2 :
            report.status === 'review' ? 1 : 0
          } orientation="vertical">
            <Step>
              <StepLabel>Draft Created</StepLabel>
            </Step>
            <Step>
              <StepLabel>Submitted for Review</StepLabel>
            </Step>
            <Step>
              <StepLabel>Finalized</StepLabel>
            </Step>
            <Step>
              <StepLabel>Published</StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Paper>
      
      {/* Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
      >
        <DialogTitle>Submit for Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this report for review? Once submitted, it will be marked as "In Review" and sent to the reviewer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleReviewRequest} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Finalize Dialog */}
      <Dialog
        open={openFinalizeDialog}
        onClose={() => setOpenFinalizeDialog(false)}
      >
        <DialogTitle>Finalize Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to finalize this report? This will mark the report as "Final" and it will be ready for publication.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFinalizeDialog(false)}>Cancel</Button>
          <Button onClick={handleFinalize} variant="contained" color="primary">
            Finalize
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Publish Dialog */}
      <Dialog
        open={openPublishDialog}
        onClose={() => setOpenPublishDialog(false)}
      >
        <DialogTitle>Publish Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to publish this report? This will generate a final PDF and mark the report as "Published". It will be available for distribution to creditors.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPublishDialog(false)}>Cancel</Button>
          <Button onClick={handlePublish} variant="contained" color="success">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportEditor;
