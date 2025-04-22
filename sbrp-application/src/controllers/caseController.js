const Case = require('../models/caseModel');
const Client = require('../models/clientModel');

// Get all cases
exports.getAllCases = async (req, res) => {
  try {
    const { status, clientId, assignedTo, search, sort, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by client if provided
    if (clientId) {
      query.clientId = clientId;
    }
    
    // Filter by assigned user if provided
    if (assignedTo) {
      query.assignedUsers = assignedTo;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { caseNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    let sortOption = { createdAt: -1 }; // Default sort by newest
    if (sort) {
      switch (sort) {
        case 'case_asc':
          sortOption = { caseNumber: 1 };
          break;
        case 'case_desc':
          sortOption = { caseNumber: -1 };
          break;
        case 'date_asc':
          sortOption = { appointmentDate: 1 };
          break;
        case 'date_desc':
          sortOption = { appointmentDate: -1 };
          break;
      }
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const cases = await Case.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('clientId', 'companyName tradingName')
      .populate('assignedUsers', 'firstName lastName')
      .populate('primaryContact', 'firstName lastName');
    
    // Get total count for pagination
    const totalCases = await Case.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: cases.length,
      total: totalCases,
      totalPages: Math.ceil(totalCases / parseInt(limit)),
      currentPage: parseInt(page),
      data: cases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving cases',
      error: error.message
    });
  }
};

// Get single case by ID
exports.getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('clientId', 'companyName tradingName acn abn contactDetails')
      .populate('assignedUsers', 'firstName lastName email')
      .populate('primaryContact', 'firstName lastName email');
    
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: caseItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving case',
      error: error.message
    });
  }
};

// Create new case
exports.createCase = async (req, res) => {
  try {
    // Check if client exists
    const client = await Client.findById(req.body.clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Generate case number if not provided
    if (!req.body.caseNumber) {
      const year = new Date().getFullYear();
      const count = await Case.countDocuments();
      req.body.caseNumber = `SBRP-${year}-${(count + 1).toString().padStart(3, '0')}`;
    }
    
    // Set primary contact to current user if not provided
    if (!req.body.primaryContact) {
      req.body.primaryContact = req.user._id;
    }
    
    // Add current user to assigned users if not included
    if (!req.body.assignedUsers || !req.body.assignedUsers.includes(req.user._id)) {
      req.body.assignedUsers = req.body.assignedUsers 
        ? [...req.body.assignedUsers, req.user._id] 
        : [req.user._id];
    }
    
    const newCase = await Case.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: newCase
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating case',
      error: error.message
    });
  }
};

// Update case
exports.updateCase = async (req, res) => {
  try {
    const caseItem = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      data: caseItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating case',
      error: error.message
    });
  }
};

// Delete case
exports.deleteCase = async (req, res) => {
  try {
    const caseItem = await Case.findByIdAndDelete(req.params.id);
    
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting case',
      error: error.message
    });
  }
};

// Update case status
exports.updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const caseItem = await Case.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Case status updated successfully',
      data: caseItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating case status',
      error: error.message
    });
  }
};

// Get case statistics
exports.getCaseStats = async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    
    // Get cases by status
    const casesByStatus = await Case.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Get cases by month
    const casesByMonth = await Case.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalCases,
        casesByStatus,
        casesByMonth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving case statistics',
      error: error.message
    });
  }
};
