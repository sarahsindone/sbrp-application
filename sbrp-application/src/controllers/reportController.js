const { ReportTemplate, Report } = require('../models/reportModel');
const Case = require('../models/caseModel');
const Client = require('../models/clientModel');
const DataCollection = require('../models/dataCollectionModel');
const asyncHandler = require('express-async-handler');

// @desc    Create new report template
// @route   POST /api/reports/templates
// @access  Private
const createReportTemplate = asyncHandler(async (req, res) => {
  const { name, description, sections, headerTemplate, footerTemplate, isDefault } = req.body;

  // Check if template with same name already exists
  const templateExists = await ReportTemplate.findOne({ name });
  if (templateExists) {
    res.status(400);
    throw new Error('Template with this name already exists');
  }

  // If setting as default, unset any existing default template
  if (isDefault) {
    await ReportTemplate.updateMany(
      { isDefault: true },
      { isDefault: false }
    );
  }

  // Create new template
  const reportTemplate = await ReportTemplate.create({
    name,
    description,
    sections: sections || [],
    headerTemplate,
    footerTemplate,
    createdBy: req.user.id,
    isDefault
  });

  if (reportTemplate) {
    res.status(201).json({
      success: true,
      data: reportTemplate
    });
  } else {
    res.status(400);
    throw new Error('Invalid template data');
  }
});

// @desc    Get all report templates
// @route   GET /api/reports/templates
// @access  Private
const getReportTemplates = asyncHandler(async (req, res) => {
  const templates = await ReportTemplate.find()
    .populate('createdBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    count: templates.length,
    data: templates
  });
});

// @desc    Get report template by ID
// @route   GET /api/reports/templates/:id
// @access  Private
const getReportTemplateById = asyncHandler(async (req, res) => {
  const template = await ReportTemplate.findById(req.params.id)
    .populate('createdBy', 'firstName lastName');

  if (template) {
    res.status(200).json({
      success: true,
      data: template
    });
  } else {
    res.status(404);
    throw new Error('Template not found');
  }
});

// @desc    Update report template
// @route   PUT /api/reports/templates/:id
// @access  Private
const updateReportTemplate = asyncHandler(async (req, res) => {
  const { name, description, sections, headerTemplate, footerTemplate, isDefault } = req.body;

  const template = await ReportTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  // If setting as default, unset any existing default template
  if (isDefault && !template.isDefault) {
    await ReportTemplate.updateMany(
      { isDefault: true },
      { isDefault: false }
    );
  }

  // Update template
  template.name = name || template.name;
  template.description = description || template.description;
  template.sections = sections || template.sections;
  template.headerTemplate = headerTemplate || template.headerTemplate;
  template.footerTemplate = footerTemplate || template.footerTemplate;
  template.isDefault = isDefault !== undefined ? isDefault : template.isDefault;

  const updatedTemplate = await template.save();

  res.status(200).json({
    success: true,
    data: updatedTemplate
  });
});

// @desc    Delete report template
// @route   DELETE /api/reports/templates/:id
// @access  Private
const deleteReportTemplate = asyncHandler(async (req, res) => {
  const template = await ReportTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  await template.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Generate new report
// @route   POST /api/reports
// @access  Private
const generateReport = asyncHandler(async (req, res) => {
  const { caseId, templateId, title } = req.body;

  // Validate case exists
  const caseExists = await Case.findById(caseId);
  if (!caseExists) {
    res.status(404);
    throw new Error('Case not found');
  }

  // Get client ID from case
  const clientId = caseExists.clientId;

  // Validate client exists
  const clientExists = await Client.findById(clientId);
  if (!clientExists) {
    res.status(404);
    throw new Error('Client not found');
  }

  // Find data collection for this case
  const dataCollection = await DataCollection.findOne({ caseId });
  if (!dataCollection) {
    res.status(404);
    throw new Error('Data collection not found for this case');
  }

  // Validate data collection is complete
  if (dataCollection.status !== 'complete') {
    res.status(400);
    throw new Error('Data collection must be complete before generating a report');
  }

  // Get template
  let template;
  if (templateId) {
    template = await ReportTemplate.findById(templateId);
    if (!template) {
      res.status(404);
      throw new Error('Template not found');
    }
  } else {
    // Use default template if no template ID provided
    template = await ReportTemplate.findOne({ isDefault: true });
    if (!template) {
      res.status(404);
      throw new Error('No default template found');
    }
  }

  // Generate report sections from template
  const reportSections = template.sections.map(section => {
    // Here we would process variables in the template content
    // For now, just copy the template content
    return {
      title: section.title,
      content: section.content,
      order: section.order,
      lastEdited: new Date()
    };
  });

  // Create report number
  const reportNumber = `SBRP-${caseExists.caseNumber}-${new Date().getFullYear()}`;

  // Create new report
  const report = await Report.create({
    caseId,
    clientId,
    dataCollectionId: dataCollection._id,
    templateId: template._id,
    title: title || `Restructuring Proposal for ${clientExists.companyName}`,
    sections: reportSections,
    metadata: {
      reportDate: new Date(),
      reportNumber,
      author: req.user.id
    },
    lastEditedBy: req.user.id
  });

  if (report) {
    res.status(201).json({
      success: true,
      data: report
    });
  } else {
    res.status(400);
    throw new Error('Failed to generate report');
  }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const { caseId, clientId, status } = req.query;
  
  // Build filter object
  const filter = {};
  if (caseId) filter.caseId = caseId;
  if (clientId) filter.clientId = clientId;
  if (status) filter.status = status;

  const reports = await Report.find(filter)
    .populate('caseId', 'caseNumber status')
    .populate('clientId', 'companyName tradingName')
    .populate('templateId', 'name')
    .populate('metadata.author', 'firstName lastName')
    .populate('lastEditedBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports
  });
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('caseId', 'caseNumber status')
    .populate('clientId', 'companyName tradingName')
    .populate('dataCollectionId')
    .populate('templateId', 'name')
    .populate('metadata.author', 'firstName lastName')
    .populate('metadata.reviewedBy', 'firstName lastName')
    .populate('metadata.approvedBy', 'firstName lastName')
    .populate('lastEditedBy', 'firstName lastName');

  if (report) {
    res.status(200).json({
      success: true,
      data: report
    });
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = asyncHandler(async (req, res) => {
  const { title, sections, status } = req.body;

  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Update report
  report.title = title || report.title;
  if (sections) {
    report.sections = sections;
  }
  if (status) {
    report.status = status;
    
    // If status is changed to published, set published date
    if (status === 'published' && report.status !== 'published') {
      report.publishedDate = new Date();
    }
  }
  report.lastEditedBy = req.user.id;

  const updatedReport = await report.save();

  res.status(200).json({
    success: true,
    data: updatedReport
  });
});

// @desc    Update report section
// @route   PATCH /api/reports/:id/section/:sectionIndex
// @access  Private
const updateReportSection = asyncHandler(async (req, res) => {
  const { id, sectionIndex } = req.params;
  const { title, content } = req.body;

  const report = await Report.findById(id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Validate section index
  if (sectionIndex < 0 || sectionIndex >= report.sections.length) {
    res.status(400);
    throw new Error('Invalid section index');
  }

  // Update section
  if (title) {
    report.sections[sectionIndex].title = title;
  }
  if (content) {
    report.sections[sectionIndex].content = content;
  }
  report.sections[sectionIndex].lastEdited = new Date();
  report.lastEditedBy = req.user.id;

  const updatedReport = await report.save();

  res.status(200).json({
    success: true,
    data: updatedReport
  });
});

// @desc    Set report review status
// @route   PATCH /api/reports/:id/review
// @access  Private
const setReportReviewStatus = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Update status to review
  report.status = 'review';
  report.metadata.reviewedBy = req.user.id;
  report.lastEditedBy = req.user.id;
  
  const updatedReport = await report.save();

  res.status(200).json({
    success: true,
    data: updatedReport
  });
});

// @desc    Finalize report
// @route   PATCH /api/reports/:id/finalize
// @access  Private
const finalizeReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Update status to final
  report.status = 'final';
  report.metadata.approvedBy = req.user.id;
  report.lastEditedBy = req.user.id;
  
  const updatedReport = await report.save();

  res.status(200).json({
    success: true,
    data: updatedReport
  });
});

// @desc    Publish report
// @route   PATCH /api/reports/:id/publish
// @access  Private
const publishReport = asyncHandler(async (req, res) => {
  const { pdfUrl } = req.body;
  
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Update status to published
  report.status = 'published';
  report.publishedDate = new Date();
  report.generatedPdfUrl = pdfUrl || report.generatedPdfUrl;
  report.lastEditedBy = req.user.id;
  
  const updatedReport = await report.save();

  res.status(200).json({
    success: true,
    data: updatedReport
  });
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  await report.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  createReportTemplate,
  getReportTemplates,
  getReportTemplateById,
  updateReportTemplate,
  deleteReportTemplate,
  generateReport,
  getReports,
  getReportById,
  updateReport,
  updateReportSection,
  setReportReviewStatus,
  finalizeReport,
  publishReport,
  deleteReport
};
