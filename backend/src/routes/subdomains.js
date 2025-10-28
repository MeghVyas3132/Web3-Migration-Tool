const express = require('express');
const router = express.Router();
const { verifySubdomain, configureSubdomain } = require('../controllers/subdomainController');
const auth = require('../middleware/auth');

router.use(auth); // All routes require authentication

router.post('/verify', verifySubdomain);
router.post('/configure', configureSubdomain);

module.exports = router;
