import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack, ArrowForward, Save, Check } from '@mui/icons-material';

// Data collection steps
const steps = [
  'Company Information',
  'Financial Details',
  'Business Operations',
  'Creditor Information',
  'Documents',
  'Review'
];

// Validation schemas for each step
const companyInfoSchema = Yup.object({
  companyName: Yup.string().required('Company name is required'),
  tradingName: Yup.string(),
  acn: Yup.string().matches(/^\d{9}$/, 'ACN must be 9 digits'),
  abn: Yup.string().matches(/^\d{11}$/, 'ABN must be 11 digits'),
  businessType: Yup.string().required('Business type is required'),
  incorporationDate: Yup.date(),
  businessDescription: Yup.string(),
  operatingRegion: Yup.string(),
  contactDetails: Yup.object({
    address: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email('Invalid email format'),
    website: Yup.string()
  })
});

const financialDetailsSchema = Yup.object({
  financialStatus: Yup.object({
    difficultiesStartDate: Yup.date(),
    currentDebtAmount: Yup.number().positive('Must be a positive number'),
    atoDebtAmount: Yup.number().min(0, 'Cannot be negative'),
    cashFlowStatus: Yup.string(),
    previousPaymentArrangements: Yup.string(),
    previousRestructuringAttempts: Yup.string()
  })
});

const businessOperationsSchema = Yup.object({
  businessOperations: Yup.object({
    employeeCount: Yup.number().integer('Must be a whole number').min(0, 'Cannot be negative'),
    annualRevenue: Yup.number().positive('Must be a positive number'),
    majorAssets: Yup.string(),
    majorLiabilities: Yup.string(),
    currentInitiatives: Yup.string(),
    plannedChanges: Yup.string()
  })
});

const DataCollection = () => {
  const { id } = useParams(); // Case ID
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { case: caseData, isLoading, error } = useSelector((state) => state.cases);
  const { client } = useSelector((state) => state.clients);
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Initial form data would be populated from case and client data
    companyName: client?.companyName || '',
    tradingName: client?.tradingName || '',
    acn: client?.acn || '',
    abn: client?.abn || '',
    businessType: client?.businessType || '',
    incorporationDate: client?.incorporationDate ? new Date(client.incorporationDate).toISOString().split('T')[0] : '',
    businessDescription: client?.businessDescription || '',
    operatingRegion: client?.operatingRegion || '',
    contactDetails: {
      address: client?.contactDetails?.address || '',
      phone: client?.contactDetails?.phone || '',
      email: client?.contactDetails?.email || '',
      website: client?.contactDetails?.website || ''
    },
    financialStatus: {
      difficultiesStartDate: client?.financialStatus?.difficultiesStartDate ? new Date(client.financialStatus.difficultiesStartDate).toISOString().split('T')[0] : '',
      currentDebtAmount: client?.financialStatus?.currentDebtAmount || '',
      atoDebtAmount: client?.financialStatus?.atoDebtAmount || '',
      cashFlowStatus: client?.financialStatus?.cashFlowStatus || '',
      previousPaymentArrangements: client?.financialStatus?.previousPaymentArrangements || '',
      previousRestructuringAttempts: client?.financialStatus?.previousRestructuringAttempts || ''
    },
    businessOperations: {
      employeeCount: client?.businessOperations?.employeeCount || '',
      annualRevenue: client?.businessOperations?.annualRevenue || '',
      majorAssets: client?.businessOperations?.majorAssets || '',
      majorLiabilities: client?.businessOperations?.majorLiabilities || '',
      currentInitiatives: client?.businessOperations?.currentInitiatives || '',
      plannedChanges: client?.businessOperations?.plannedChanges || ''
    },
    directors: client?.directors || []
  });
  
  const [savingDraft, setSavingDraft] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Get current validation schema based on active step
  const getValidationSchema = () => {
    switch (activeStep) {
      case 0:
        return companyInfoSchema;
      case 1:
        return financialDetailsSchema;
      case 2:
        return businessOperationsSchema;
      default:
        return Yup.object({});
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSaveDraft = async (values) => {
    setSavingDraft(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Here you would dispatch an action to save the draft data
      // For example: await dispatch(updateCaseData({ id, data: values }));
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setFormData(values);
    } catch (error) {
      setSaveError('Failed to save draft. Please try again.');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async (values) => {
    // Final submission logic
    console.log('Final form data:', values);
    // Navigate to the next step in the process
    navigate(`/cases/${id}`);
  };

  // Render different form sections based on active step
  const renderStepContent = (step, formikProps) => {
    const { values, touched, errors, handleChange, setFieldValue } = formikProps;
    
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  error={touched.companyName && Boolean(errors.companyName)}
                  helperText={touched.companyName && errors.companyName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Trading Name"
                  name="tradingName"
                  value={values.tradingName}
                  onChange={handleChange}
                  error={touched.tradingName && Boolean(errors.tradingName)}
                  helperText={touched.tradingName && errors.tradingName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="ACN"
                  name="acn"
                  value={values.acn}
                  onChange={handleChange}
                  error={touched.acn && Boolean(errors.acn)}
                  helperText={touched.acn && errors.acn}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="ABN"
                  name="abn"
                  value={values.abn}
                  onChange={handleChange}
                  error={touched.abn && Boolean(errors.abn)}
                  helperText={touched.abn && errors.abn}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  label="Business Type"
                  name="businessType"
                  value={values.businessType}
                  onChange={handleChange}
                  error={touched.businessType && Boolean(errors.businessType)}
                  helperText={touched.businessType && errors.businessType}
                  required
                >
                  <MenuItem value="Sole Trader">Sole Trader</MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
                  <MenuItem value="Company">Company</MenuItem>
                  <MenuItem value="Trust">Trust</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Incorporation Date"
                  name="incorporationDate"
                  type="date"
                  value={values.incorporationDate}
                  onChange={handleChange}
                  error={touched.incorporationDate && Boolean(errors.incorporationDate)}
                  helperText={touched.incorporationDate && errors.incorporationDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Business Description"
                  name="businessDescription"
                  multiline
                  rows={4}
                  value={values.businessDescription}
                  onChange={handleChange}
                  error={touched.businessDescription && Boolean(errors.businessDescription)}
                  helperText={touched.businessDescription && errors.businessDescription}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Operating Region"
                  name="operatingRegion"
                  value={values.operatingRegion}
                  onChange={handleChange}
                  error={touched.operatingRegion && Boolean(errors.operatingRegion)}
                  helperText={touched.operatingRegion && errors.operatingRegion}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Contact Details
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Address"
                  name="contactDetails.address"
                  value={values.contactDetails.address}
                  onChange={handleChange}
                  error={touched.contactDetails?.address && Boolean(errors.contactDetails?.address)}
                  helperText={touched.contactDetails?.address && errors.contactDetails?.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Phone"
                  name="contactDetails.phone"
                  value={values.contactDetails.phone}
                  onChange={handleChange}
                  error={touched.contactDetails?.phone && Boolean(errors.contactDetails?.phone)}
                  helperText={touched.contactDetails?.phone && errors.contactDetails?.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Email"
                  name="contactDetails.email"
                  value={values.contactDetails.email}
                  onChange={handleChange}
                  error={touched.contactDetails?.email && Boolean(errors.contactDetails?.email)}
                  helperText={touched.contactDetails?.email && errors.contactDetails?.email}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Website"
                  name="contactDetails.website"
                  value={values.contactDetails.website}
                  onChange={handleChange}
                  error={touched.contactDetails?.website && Boolean(errors.contactDetails?.website)}
                  helperText={touched.contactDetails?.website && errors.contactDetails?.website}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Financial Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="When did financial difficulties begin?"
                  name="financialStatus.difficultiesStartDate"
                  type="date"
                  value={values.financialStatus.difficultiesStartDate}
                  onChange={handleChange}
                  error={touched.financialStatus?.difficultiesStartDate && Boolean(errors.financialStatus?.difficultiesStartDate)}
                  helperText={touched.financialStatus?.difficultiesStartDate && errors.financialStatus?.difficultiesStartDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  label="Cash Flow Status"
                  name="financialStatus.cashFlowStatus"
                  value={values.financialStatus.cashFlowStatus}
                  onChange={handleChange}
                  error={touched.financialStatus?.cashFlowStatus && Boolean(errors.financialStatus?.cashFlowStatus)}
                  helperText={touched.financialStatus?.cashFlowStatus && errors.financialStatus?.cashFlowStatus}
                >
                  <MenuItem value="Positive">Positive</MenuItem>
                  <MenuItem value="Break-even">Break-even</MenuItem>
                  <MenuItem value="Negative">Negative</MenuItem>
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Current Debt Amount ($)"
                  name="financialStatus.currentDebtAmount"
                  type="number"
                  value={values.financialStatus.currentDebtAmount}
                  onChange={handleChange}
                  error={touched.financialStatus?.currentDebtAmount && Boolean(errors.financialStatus?.currentDebtAmount)}
                  helperText={touched.financialStatus?.currentDebtAmount && errors.financialStatus?.currentDebtAmount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="ATO Debt Amount ($)"
                  name="financialStatus.atoDebtAmount"
                  type="number"
                  value={values.financialStatus.atoDebtAmount}
                  onChange={handleChange}
                  error={touched.financialStatus?.atoDebtAmount && Boolean(errors.financialStatus?.atoDebtAmount)}
                  helperText={touched.financialStatus?.atoDebtAmount && errors.financialStatus?.atoDebtAmount}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Previous Payment Arrangements"
                  name="financialStatus.previousPaymentArrangements"
                  multiline
                  rows={3}
                  value={values.financialStatus.previousPaymentArrangements}
                  onChange={handleChange}
                  error={touched.financialStatus?.previousPaymentArrangements && Boolean(errors.financialStatus?.previousPaymentArrangements)}
                  helperText={touched.financialStatus?.previousPaymentArrangements && errors.financialStatus?.previousPaymentArrangements}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Previous Restructuring Attempts"
                  name="financialStatus.previousRestructuringAttempts"
                  multiline
                  rows={3}
                  value={values.financialStatus.previousRestructuringAttempts}
                  onChange={handleChange}
                  error={touched.financialStatus?.previousRestructuringAttempts && Boolean(errors.financialStatus?.previousRestructuringAttempts)}
                  helperText={touched.financialStatus?.previousRestructuringAttempts && errors.financialStatus?.previousRestructuringAttempts}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Business Operations
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Number of Employees"
                  name="businessOperations.employeeCount"
                  type="number"
                  value={values.businessOperations.employeeCount}
                  onChange={handleChange}
                  error={touched.businessOperations?.employeeCount && Boolean(errors.businessOperations?.employeeCount)}
                  helperText={touched.businessOperations?.employeeCount && errors.businessOperations?.employeeCount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Annual Revenue ($)"
                  name="businessOperations.annualRevenue"
                  type="number"
                  value={values.businessOperations.annualRevenue}
                  onChange={handleChange}
                  error={touched.businessOperations?.annualRevenue && Boolean(errors.businessOperations?.annualRevenue)}
                  helperText={touched.businessOperations?.annualRevenue && errors.businessOperations?.annualRevenue}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Major Assets"
                  name="businessOperations.majorAssets"
                  multiline
                  rows={4}
                  value={values.businessOperations.majorAssets}
                  onChange={handleChange}
                  error={touched.businessOperations?.majorAssets && Boolean(errors.businessOperations?.majorAssets)}
                  helperText={touched.businessOperations?.majorAssets && errors.businessOperations?.majorAssets}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Major Liabilities"
                  name="businessOperations.majorLiabilities"
                  multiline
                  rows={4}
                  value={values.businessOperations.majorLiabilities}
                  onChange={handleChange}
                  error={touched.businessOperations?.majorLiabilities && Boolean(errors.businessOperations?.majorLiabilities)}
                  helperText={touched.businessOperations?.majorLiabilities && errors.businessOperations?.majorLiabilities}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Current Business Initiatives"
                  name="businessOperations.currentInitiatives"
                  multiline
                  rows={3}
                  value={values.businessOperations.currentInitiatives}
                  onChange={handleChange}
                  error={touched.businessOperations?.currentInitiatives && Boolean(errors.businessOperations?.currentInitiatives)}
                  helperText={touched.businessOperations?.currentInitiatives && errors.businessOperations?.currentInitiatives}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Planned Changes"
                  name="businessOperations.plannedChanges"
                  multiline
                  rows={3}
                  value={values.businessOperations.plannedChanges}
                  onChange={handleChange}
                  error={touched.businessOperations?.plannedChanges && Boolean(errors.businessOperations?.plannedChanges)}
                  helperText={touched.businessOperations?.plannedChanges && errors.businessOperations?.plannedChanges}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Creditor Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              This section will be implemented in the next phase of development.
            </Typography>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              This section will be implemented in the next phase of development.
            </Typography>
          </Box>
        );
      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" gutterBottom>
              Please review all the information before final submission.
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Company Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Company Name</Typography>
                  <Typography variant="body1">{values.companyName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Trading Name</Typography>
                  <Typography variant="body1">{values.tradingName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">ACN</Typography>
                  <Typography variant="body1">{values.acn || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">ABN</Typography>
                  <Typography variant="body1">{values.abn || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Business Type</Typography>
                  <Typography variant="body1">{values.businessType}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Financial Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Current Debt Amount</Typography>
                  <Typography variant="body1">
                    {values.financialStatus.currentDebtAmount ? `$${values.financialStatus.currentDebtAmount.toLocaleString()}` : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">ATO Debt Amount</Typography>
                  <Typography variant="body1">
                    {values.financialStatus.atoDebtAmount ? `$${values.financialStatus.atoDebtAmount.toLocaleString()}` : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Business Operations
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Number of Employees</Typography>
                  <Typography variant="body1">{values.businessOperations.employeeCount || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Annual Revenue</Typography>
                  <Typography variant="body1">
                    {values.businessOperations.annualRevenue ? `$${values.businessOperations.annualRevenue.toLocaleString()}` : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Data Collection
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Case: {caseData?.caseNumber || id}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Draft saved successfully!
          </Alert>
        )}
        
        {saveError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {saveError}
          </Alert>
        )}
        
        <Formik
          initialValues={formData}
          validationSchema={getValidationSchema()}
          onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {(formikProps) => (
            <Form>
              {renderStepContent(activeStep, formikProps)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => handleSaveDraft(formikProps.values)}
                    disabled={savingDraft}
                    startIcon={<Save />}
                    sx={{ mr: 1 }}
                  >
                    {savingDraft ? <CircularProgress size={24} /> : 'Save Draft'}
                  </Button>
                  
                  <Button
                    variant="contained"
                    type="submit"
                    endIcon={activeStep === steps.length - 1 ? <Check /> : <ArrowForward />}
                  >
                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default DataCollection;
