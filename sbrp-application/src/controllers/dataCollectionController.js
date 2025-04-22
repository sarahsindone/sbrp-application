const DataCollection = require('../models/dataCollectionModel');
const Case = require('../models/caseModel');
const Client = require('../models/clientModel');
const asyncHandler = require('express-async-handler');

// @desc    Create new data collection
// @route   POST /api/data-collection
// @access  Private
const createDataCollection = asyncHandler(async (req, res) => {
  const { caseId, clientId } = req.body;

  // Validate case and client exist
  const caseExists = await Case.findById(caseId);
  if (!caseExists) {
    res.status(404);
    throw new Error('Case not found');
  }

  const clientExists = await Client.findById(clientId);
  if (!clientExists) {
    res.status(404);
    throw new Error('Client not found');
  }

  // Check if data collection already exists for this case
  const existingDataCollection = await DataCollection.findOne({ caseId });
  if (existingDataCollection) {
    res.status(400);
    throw new Error('Data collection already exists for this case');
  }

  // Create new data collection
  const dataCollection = await DataCollection.create({
    caseId,
    clientId,
    lastUpdatedBy: req.user.id
  });

  if (dataCollection) {
    res.status(201).json({
      success: true,
      data: dataCollection
    });
  } else {
    res.status(400);
    throw new Error('Invalid data collection data');
  }
});

// @desc    Get all data collections
// @route   GET /api/data-collection
// @access  Private
const getDataCollections = asyncHandler(async (req, res) => {
  const { caseId, clientId, status } = req.query;
  
  // Build filter object
  const filter = {};
  if (caseId) filter.caseId = caseId;
  if (clientId) filter.clientId = clientId;
  if (status) filter.status = status;

  const dataCollections = await DataCollection.find(filter)
    .populate('caseId', 'caseNumber status')
    .populate('clientId', 'companyName tradingName')
    .populate('lastUpdatedBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    count: dataCollections.length,
    data: dataCollections
  });
});

// @desc    Get data collection by ID
// @route   GET /api/data-collection/:id
// @access  Private
const getDataCollectionById = asyncHandler(async (req, res) => {
  const dataCollection = await DataCollection.findById(req.params.id)
    .populate('caseId', 'caseNumber status')
    .populate('clientId', 'companyName tradingName')
    .populate('lastUpdatedBy', 'firstName lastName');

  if (dataCollection) {
    res.status(200).json({
      success: true,
      data: dataCollection
    });
  } else {
    res.status(404);
    throw new Error('Data collection not found');
  }
});

// @desc    Get data collection by case ID
// @route   GET /api/data-collection/case/:caseId
// @access  Private
const getDataCollectionByCaseId = asyncHandler(async (req, res) => {
  const dataCollection = await DataCollection.findOne({ caseId: req.params.caseId })
    .populate('caseId', 'caseNumber status')
    .populate('clientId', 'companyName tradingName')
    .populate('lastUpdatedBy', 'firstName lastName');

  if (dataCollection) {
    res.status(200).json({
      success: true,
      data: dataCollection
    });
  } else {
    res.status(404);
    throw new Error('Data collection not found for this case');
  }
});

// @desc    Update data collection
// @route   PUT /api/data-collection/:id
// @access  Private
const updateDataCollection = asyncHandler(async (req, res) => {
  const dataCollection = await DataCollection.findById(req.params.id);

  if (!dataCollection) {
    res.status(404);
    throw new Error('Data collection not found');
  }

  // Update the data collection with new data
  const updatedDataCollection = await DataCollection.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      lastUpdatedBy: req.user.id
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedDataCollection
  });
});

// @desc    Update data collection section
// @route   PATCH /api/data-collection/:id/section/:section
// @access  Private
const updateDataCollectionSection = asyncHandler(async (req, res) => {
  const { id, section } = req.params;
  const dataCollection = await DataCollection.findById(id);

  if (!dataCollection) {
    res.status(404);
    throw new Error('Data collection not found');
  }

  // Validate section name
  const validSections = ['companyInformation', 'financialDetails', 'businessOperations', 'creditorInformation', 'documents'];
  if (!validSections.includes(section)) {
    res.status(400);
    throw new Error('Invalid section name');
  }

  // Create update object
  const updateData = {
    [section]: req.body,
    [`completedSections.${section}`]: true,
    lastUpdatedBy: req.user.id
  };

  // Update the specific section
  const updatedDataCollection = await DataCollection.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedDataCollection
  });
});

// @desc    Mark data collection as complete
// @route   PATCH /api/data-collection/:id/complete
// @access  Private
const completeDataCollection = asyncHandler(async (req, res) => {
  const dataCollection = await DataCollection.findById(req.params.id);

  if (!dataCollection) {
    res.status(404);
    throw new Error('Data collection not found');
  }

  // Check if all sections are completed
  const { completedSections } = dataCollection;
  const allSectionsCompleted = Object.values(completedSections).every(value => value === true);

  if (!allSectionsCompleted) {
    res.status(400);
    throw new Error('Cannot mark as complete. Some sections are not completed yet.');
  }

  // Update status to complete
  dataCollection.status = 'complete';
  dataCollection.lastUpdatedBy = req.user.id;
  await dataCollection.save();

  res.status(200).json({
    success: true,
    data: dataCollection
  });
});

// @desc    Delete data collection
// @route   DELETE /api/data-collection/:id
// @access  Private
const deleteDataCollection = asyncHandler(async (req, res) => {
  const dataCollection = await DataCollection.findById(req.params.id);

  if (!dataCollection) {
    res.status(404);
    throw new Error('Data collection not found');
  }

  await dataCollection.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  createDataCollection,
  getDataCollections,
  getDataCollectionById,
  getDataCollectionByCaseId,
  updateDataCollection,
  updateDataCollectionSection,
  completeDataCollection,
  deleteDataCollection
};
