const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(authMiddleware.protect);

// Get current user
router.get('/me', userController.getCurrentUser);

// Change password
router.post('/change-password', userController.changePassword);

// Admin only routes
router.use(authMiddleware.restrictTo('admin'));

// Get all users
router.get('/', userController.getAllUsers);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
