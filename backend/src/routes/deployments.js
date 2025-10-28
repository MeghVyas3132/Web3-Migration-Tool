const express = require('express');
const router = express.Router();
const {
  getDeployments,
  getDeployment,
  createDeployment,
  deleteDeployment,
} = require('../controllers/deploymentController');
const auth = require('../middleware/auth');

router.use(auth); // All routes require authentication

router.route('/')
  .get(getDeployments)
  .post(createDeployment); // Removed upload middleware

router.route('/:id')
  .get(getDeployment)
  .delete(deleteDeployment);

module.exports = router;
