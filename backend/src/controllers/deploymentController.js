const Deployment = require('../models/Deployment');
const ipfsService = require('../services/ipfsService');
const nginxService = require('../services/dnsService'); // Now using Nginx service
const githubService = require('../services/githubService');
const fs = require('fs').promises;

// @desc    Get all deployments for user
// @route   GET /api/v1/deployments
// @access  Private
exports.getDeployments = async (req, res) => {
  try {
    const deployments = await Deployment.find({ userId: req.user.id });

    res.json(deployments);
  } catch (error) {
    console.error('Get deployments error:', error);
    res.status(500).json({ message: 'Error fetching deployments', error: error.message });
  }
};

// @desc    Get single deployment
// @route   GET /api/v1/deployments/:id
// @access  Private
exports.getDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deployment) {
      return res.status(404).json({ message: 'Deployment not found' });
    }

    res.json(deployment);
  } catch (error) {
    console.error('Get deployment error:', error);
    res.status(500).json({ message: 'Error fetching deployment', error: error.message });
  }
};

// @desc    Create new deployment from GitHub
// @route   POST /api/v1/deployments
// @access  Private
exports.createDeployment = async (req, res) => {
  let projectPath = null;

  try {
    const { subdomain, githubUrl, branch = 'main' } = req.body;

    // Validate inputs
    if (!subdomain) {
      return res.status(400).json({ message: 'Subdomain is required' });
    }

    if (!githubUrl) {
      return res.status(400).json({ message: 'GitHub repository URL is required' });
    }

    // Validate GitHub URL
    if (!githubService.isValidGitHubUrl(githubUrl)) {
      return res.status(400).json({ message: 'Invalid GitHub URL. Please provide a valid GitHub repository URL.' });
    }

    // Check if subdomain is available
    const existingDeployment = await Deployment.findOne({ subdomain });
    if (existingDeployment) {
      return res.status(400).json({ message: 'Subdomain already taken' });
    }

    // Normalize GitHub URL
    const normalizedUrl = githubService.normalizeGitHubUrl(githubUrl);

    // Clone the repository
    console.log(`Cloning repository: ${normalizedUrl}`);
    projectPath = await githubService.cloneRepository(normalizedUrl, branch);

    // Detect project type
    console.log('Detecting project type...');
    const projectMetadata = await githubService.detectProjectType(projectPath);

    // Build the project if needed
    if (projectMetadata.buildCommand) {
      console.log(`Building project with ${projectMetadata.framework}...`);
      await githubService.buildProject(projectPath, projectMetadata.buildCommand);
    }

    // Get build output directory
    const buildPath = await githubService.getBuildOutput(projectPath, projectMetadata.buildDir);
    console.log(`Using build output from: ${buildPath}`);

    // Upload to IPFS
    console.log('Uploading to IPFS...');
    const ipfsCID = await ipfsService.uploadToIPFS(buildPath);

    // Create deployment record
    const deployment = await Deployment.create({
      userId: req.user.id,
      subdomain,
      ipfsCID,
      framework: projectMetadata.framework,
      buildCommand: projectMetadata.buildCommand,
      githubUrl: normalizedUrl,
      branch,
      status: 'active',
    });

    // Configure Nginx (in production, this will create actual Nginx config)
    try {
      await nginxService.configureDNS(subdomain, ipfsCID);
    } catch (nginxError) {
      console.error('Nginx configuration error:', nginxError);
      // Continue even if Nginx config fails (for development)
    }

    // Clean up cloned repository
    await githubService.cleanup(projectPath);

    res.status(201).json(deployment);
  } catch (error) {
    console.error('Create deployment error:', error);
    
    // Clean up cloned repository if it exists
    if (projectPath) {
      try {
        await githubService.cleanup(projectPath);
      } catch (cleanupError) {
        console.error('Error cleaning up project:', cleanupError);
      }
    }

    res.status(500).json({ 
      message: 'Error creating deployment', 
      error: error.message 
    });
  }
};

// @desc    Delete deployment
// @route   DELETE /api/v1/deployments/:id
// @access  Private
exports.deleteDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deployment) {
      return res.status(404).json({ message: 'Deployment not found' });
    }

    // Remove Nginx configuration (in production)
    try {
      await nginxService.removeDNS(deployment.subdomain);
    } catch (nginxError) {
      console.error('Nginx removal error:', nginxError);
    }

    await Deployment.deleteOne({ _id: req.params.id, userId: req.user.id });

    res.json({ message: 'Deployment deleted successfully' });
  } catch (error) {
    console.error('Delete deployment error:', error);
    res.status(500).json({ message: 'Error deleting deployment', error: error.message });
  }
};
