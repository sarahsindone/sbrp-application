const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

// Get all clients with filtering, sorting, and pagination
router.get('/', clientController.getAllClients);

// Get client statistics
router.get('/stats', clientController.getClientStats);

// Get single client by ID
router.get('/:id', clientController.getClientById);

// Create new client
router.post('/', clientController.createClient);

// Update client
router.put('/:id', clientController.updateClient);

// Delete client - restrict to admin only
router.delete('/:id', authMiddleware.restrictTo('admin'), clientController.deleteClient);

module.exports = router;
