const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const execPromise = promisify(exec);

class GitHubService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
  }

  /**
   * Clone a GitHub repository
   * @param {string} repoUrl - GitHub repository URL
   * @param {string} branch - Branch to clone (default: main)
   * @returns {Promise<string>} - Path to cloned repository
   */
  async cloneRepository(repoUrl, branch = 'main') {
    try {
      // Check if git is installed
      try {
        await execPromise('git --version');
        console.log('✅ Git is installed');
      } catch (error) {
        throw new Error('Git is not installed on the system');
      }

      // Ensure temp directory exists and is writable
      try {
        await fs.mkdir(this.tempDir, { recursive: true });
        const testFile = path.join(this.tempDir, '.test');
        await fs.writeFile(testFile, '');
        await fs.unlink(testFile);
        console.log('✅ Temp directory is writable:', this.tempDir);
      } catch (error) {
        throw new Error(`Cannot write to temp directory ${this.tempDir}: ${error.message}`);
      }

      // Generate unique directory name
      const repoName = this.extractRepoName(repoUrl);
      const timestamp = Date.now();
      const clonePath = path.join(this.tempDir, `${repoName}-${timestamp}`);

      console.log(`📦 Cloning ${repoUrl} to ${clonePath}...`);

      // Clone repository with specific branch
      const cloneCommand = `git clone --depth 1 --branch ${branch} ${repoUrl} ${clonePath}`;
      
      try {
        const { stdout, stderr } = await execPromise(cloneCommand);
        console.log('Clone output:', stdout);
        if (stderr) console.warn('Clone warnings:', stderr);
      } catch (error) {
        // If branch doesn't exist, try default branch
        console.log(`⚠️  Branch ${branch} not found, trying default branch...`);
        const fallbackCommand = `git clone --depth 1 ${repoUrl} ${clonePath}`;
        try {
          const { stdout, stderr } = await execPromise(fallbackCommand);
          console.log('Clone output:', stdout);
          if (stderr) console.warn('Clone warnings:', stderr);
        } catch (fallbackError) {
          throw new Error(`Failed to clone with fallback: ${fallbackError.message}`);
        }
      }

      // Verify the clone was successful
      try {
        await fs.access(path.join(clonePath, '.git'));
        console.log('✅ Repository cloned successfully');
      } catch (error) {
        throw new Error('Repository was not cloned properly');
      }

      return clonePath;
    } catch (error) {
      console.error('🚨 Clone repository error:', error);
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  /**
   * Detect project type and framework
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<Object>} - Project metadata
   */
  async detectProjectType(projectPath) {
    try {
      const files = await fs.readdir(projectPath);
      const metadata = {
        framework: 'html',
        buildCommand: null,
        buildDir: null,
        hasPackageJson: false,
      };

      // Check for package.json
      if (files.includes('package.json')) {
        metadata.hasPackageJson = true;
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

        // Detect framework
        const dependencies = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        if (dependencies.react || dependencies['react-dom']) {
          metadata.framework = 'react';
          metadata.buildCommand = packageJson.scripts?.build || 'npm run build';
          metadata.buildDir = 'build';
          
          // Check for Vite
          if (dependencies.vite) {
            metadata.buildDir = 'dist';
          }
        } else if (dependencies.vue) {
          metadata.framework = 'vue';
          metadata.buildCommand = packageJson.scripts?.build || 'npm run build';
          metadata.buildDir = 'dist';
        } else if (dependencies['@angular/core']) {
          metadata.framework = 'angular';
          metadata.buildCommand = packageJson.scripts?.build || 'ng build --prod';
          metadata.buildDir = 'dist';
        } else if (dependencies.next) {
          metadata.framework = 'nextjs';
          metadata.buildCommand = 'npm run build && next export';
          metadata.buildDir = 'out';
        } else if (dependencies.svelte) {
          metadata.framework = 'svelte';
          metadata.buildCommand = packageJson.scripts?.build || 'npm run build';
          metadata.buildDir = 'public';
        } else {
          metadata.framework = 'nodejs';
          metadata.buildCommand = packageJson.scripts?.build || null;
          metadata.buildDir = packageJson.scripts?.build ? 'dist' : null;
        }
      }

      return metadata;
    } catch (error) {
      console.error('Detect project type error:', error);
      return {
        framework: 'html',
        buildCommand: null,
        buildDir: null,
        hasPackageJson: false,
      };
    }
  }

  /**
   * Build the project
   * @param {string} projectPath - Path to project directory
   * @param {string} buildCommand - Build command to execute
   * @returns {Promise<string>} - Path to build directory
   */
  async buildProject(projectPath, buildCommand) {
    try {
      if (!buildCommand) {
        // No build needed, return project path
        return projectPath;
      }

      console.log(`Installing dependencies in ${projectPath}...`);
      
      // Install dependencies
      await execPromise('npm install', { cwd: projectPath, maxBuffer: 10 * 1024 * 1024 });

      console.log(`Building project with command: ${buildCommand}`);
      
      // Run build command with increased buffer
      await execPromise(buildCommand, {
        cwd: projectPath,
        maxBuffer: 10 * 1024 * 1024,
        timeout: 300000, // 5 minutes timeout
      });

      return projectPath;
    } catch (error) {
      console.error('Build project error:', error);
      throw new Error(`Failed to build project: ${error.message}`);
    }
  }

  /**
   * Get the build output directory
   * @param {string} projectPath - Path to project directory
   * @param {string} buildDir - Build directory name
   * @returns {Promise<string>} - Path to build output
   */
  async getBuildOutput(projectPath, buildDir) {
    try {
      if (!buildDir) {
        return projectPath;
      }

      const buildPath = path.join(projectPath, buildDir);
      
      // Check if build directory exists
      try {
        await fs.access(buildPath);
        return buildPath;
      } catch (error) {
        // Build directory not found, check common alternatives
        const alternatives = ['build', 'dist', 'out', 'public'];
        
        for (const alt of alternatives) {
          const altPath = path.join(projectPath, alt);
          try {
            await fs.access(altPath);
            return altPath;
          } catch (e) {
            continue;
          }
        }

        // No build directory found, return project root
        return projectPath;
      }
    } catch (error) {
      console.error('Get build output error:', error);
      return projectPath;
    }
  }

  /**
   * Clean up temporary directory
   * @param {string} projectPath - Path to project directory
   */
  async cleanup(projectPath) {
    try {
      if (projectPath && projectPath.startsWith(this.tempDir)) {
        await fs.rm(projectPath, { recursive: true, force: true });
        console.log(`Cleaned up ${projectPath}`);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  /**
   * Extract repository name from URL
   * @param {string} repoUrl - GitHub repository URL
   * @returns {string} - Repository name
   */
  extractRepoName(repoUrl) {
    // Handle various GitHub URL formats
    // https://github.com/user/repo
    // https://github.com/user/repo.git
    // git@github.com:user/repo.git
    
    let name = repoUrl;
    
    // Remove .git extension
    name = name.replace(/\.git$/, '');
    
    // Extract repo name
    const match = name.match(/([^/]+)$/);
    if (match) {
      return match[1];
    }
    
    return 'project';
  }

  /**
   * Validate GitHub URL
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid GitHub URL
   */
  isValidGitHubUrl(url) {
    const githubPattern = /^(https?:\/\/)?(www\.)?(github\.com|raw\.githubusercontent\.com)\/[\w-]+\/[\w.-]+/i;
    const gitPattern = /^git@github\.com:[\w-]+\/[\w.-]+\.git$/i;
    
    return githubPattern.test(url) || gitPattern.test(url);
  }

  /**
   * Convert various GitHub URL formats to HTTPS
   * @param {string} url - GitHub URL
   * @returns {string} - Normalized HTTPS URL
   */
  normalizeGitHubUrl(url) {
    // Convert SSH to HTTPS
    if (url.startsWith('git@github.com:')) {
      return url.replace('git@github.com:', 'https://github.com/');
    }
    
    // Ensure HTTPS
    if (!url.startsWith('http')) {
      return `https://github.com/${url}`;
    }
    
    return url;
  }
}

module.exports = new GitHubService();
