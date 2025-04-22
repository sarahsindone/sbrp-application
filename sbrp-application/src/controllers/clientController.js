const Client = require('../models/clientModel');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const { status, search, sort, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { tradingName: { $regex: search, $options: 'i' } },
        { acn: { $regex: search, $options: 'i' } },
        { abn: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    let sortOption = { createdAt: -1 }; // Default sort by newest
    if (sort) {
      switch (sort) {
        case 'name_asc':
          sortOption = { companyName: 1 };
          break;
        case 'name_desc':
          sortOption = { companyName: -1 };
          break;
        case 'date_asc':
          sortOption = { createdAt: 1 };
          break;
        case 'date_desc':
          sortOption = { createdAt: -1 };
          break;
      }
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const clients = await Client.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedPractitioner', 'firstName lastName');
    
    // Get total count for pagination
    const totalClients = await Client.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: clients.length,
      total: totalClients,
      totalPages: Math.ceil(totalClients / parseInt(limit)),
      currentPage: parseInt(page),
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving clients',
      error: error.message
    });
  }
};

// Get single client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedPractitioner', 'firstName lastName email');
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving client',
      error: error.message
    });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: newClient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
};

// Get client statistics
exports.getClientStats = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const activeClients = await Client.countDocuments({ status: 'active' });
    const completedClients = await Client.countDocuments({ status: 'completed' });
    const archivedClients = await Client.countDocuments({ status: 'archived' });
    
    // Get clients by business type
    const clientsByType = await Client.aggregate([
      {
        $group: {
          _id: '$businessType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalClients,
        activeClients,
        completedClients,
        archivedClients,
        clientsByType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving client statistics',
      error: error.message
    });
  }
};
