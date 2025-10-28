const express = require('express');
const router = express.Router();
const {
  getDeployments,
  getDeployment,
  createDeployment,
  deleteDeployment,
} = require('../controllers/deploymentController');

router.route('/')
  .get(getDeployments)
  .post(createDeployment); // Removed upload middleware

router.route('/:id')
  .get(getDeployment)
  .delete(deleteDeployment);

module.exports = router;
