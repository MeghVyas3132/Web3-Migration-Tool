const Deployment = require('../models/Deployment');

// @desc    Check subdomain availability
// @route   POST /api/v1/subdomains/verify
// @access  Private
exports.verifySubdomain = async (req, res) => {
  try {
    const { subdomain } = req.body;

    if (!subdomain) {
      return res.status(400).json({ message: 'Subdomain is required' });
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return res.status(400).json({
        message: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
      });
    }

    // Check if subdomain exists
    const existingDeployment = await Deployment.findOne({ subdomain });

    res.json({
      available: !existingDeployment,
      subdomain,
    });
  } catch (error) {
    console.error('Verify subdomain error:', error);
    res.status(500).json({ message: 'Error verifying subdomain', error: error.message });
  }
};

// @desc    Configure subdomain DNS
// @route   POST /api/v1/subdomains/configure
// @access  Private
exports.configureSubdomain = async (req, res) => {
  try {
    const { subdomain, ipfsCID } = req.body;

    // In production, this would configure Cloudflare DNS
    // For now, we'll just return success
    res.json({
      success: true,
      subdomain,
      url: `https://${subdomain}.${process.env.BASE_DOMAIN || 'web3host.xyz'}`,
    });
  } catch (error) {
    console.error('Configure subdomain error:', error);
    res.status(500).json({ message: 'Error configuring subdomain', error: error.message });
  }
};
