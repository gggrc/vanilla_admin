// Permission Routes
const express = require('express');
const router = express.Router();
const {
  getAllPermissions,
  getPermissionDetail,
  updatePermissionStatus
} = require('../controllers/permissionController');

/**
 * GET /api/permissions
 * Get all permission requests with optional status filter
 * Query params: status (optional) - 'pending', 'approved', 'rejected', 'all'
 */
router.get('/', getAllPermissions);

/**
 * GET /api/permissions/:permissionId
 * Get detailed information about a specific permission request
 */
router.get('/:permissionId', getPermissionDetail);

/**
 * PATCH /api/permissions/:permissionId/status
 * Update permission status (approve or reject)
 * Body: { status: 'approved' | 'rejected', admin_id: '<admin_user_id>' }
 */
router.patch('/:permissionId/status', updatePermissionStatus);

module.exports = router;
