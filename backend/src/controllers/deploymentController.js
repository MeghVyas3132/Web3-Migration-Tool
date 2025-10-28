const Deployment = require('../models/Deployment');
const ipfsService = require('../services/ipfsService');
const githubService = require('../services/githubService');
const fs = require('fs').promises;

// @desc    Get all deployments
// @route   GET /api/v1/deployments
// @access  Public
exports.getDeployments = async (req, res) => {
  try {
    const deployments = await Deployment.find();
    res.json({
      success: true,
      data: deployments
    });
  } catch (error) {
    console.error('Get deployments error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching deployments'
    });
  }
};

// @desc    Get single deployment
// @route   GET /api/v1/deployments/:id
// @access  Public
exports.getDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);

    if (!deployment) {
      return res.status(404).json({
        success: false,
        message: 'Deployment not found'
      });
    }

    res.json({
      success: true,
      data: deployment
    });
  } catch (error) {
    console.error('Get deployment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deployment'
    });
  }
};

// @desc    Create new deployment from GitHub
// @route   POST /api/v1/deployments
// @access  Public
exports.createDeployment = async (req, res) => {
  let projectPath = null;

  try {
    const { githubUrl, branch = 'main' } = req.body;

    // Validate inputs
    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: 'GitHub repository URL is required'
      });
    }

    // Validate GitHub URL
    if (!githubService.isValidGitHubUrl(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL. Please provide a valid GitHub repository URL.'
      });
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
      ipfsCID,
      framework: projectMetadata.framework,
      buildCommand: projectMetadata.buildCommand,
      githubUrl: normalizedUrl,
      branch,
      status: 'active',
    });

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

    console.error('🚨 Full deployment error:', error);
    res.status(500).json({ 
      message: 'Error creating deployment', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    });

    if (!deployment) {
      return res.status(404).json({ message: 'Deployment not found' });
    }

    // No need to remove Nginx configuration anymore as we're not using subdomains

    await Deployment.deleteOne({ _id: req.params.id });

    res.json({ message: 'Deployment deleted successfully' });
  } catch (error) {
    console.error('Delete deployment error:', error);
    res.status(500).json({ message: 'Error deleting deployment', error: error.message });
  }
};
