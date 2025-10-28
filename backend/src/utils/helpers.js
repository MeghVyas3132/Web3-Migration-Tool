const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

const getFrameworkDefaults = (framework) => {
  const defaults = {
    react: {
      buildCommand: 'npm run build',
      outputDir: 'build',
    },
    vue: {
      buildCommand: 'npm run build',
      outputDir: 'dist',
    },
    nextjs: {
      buildCommand: 'npm run build && npm run export',
      outputDir: 'out',
    },
    angular: {
      buildCommand: 'npm run build',
      outputDir: 'dist',
    },
    html: {
      buildCommand: '',
      outputDir: '.',
    },
  };

  return defaults[framework] || defaults.html;
};

module.exports = {
  formatDate,
  generateRandomString,
  sanitizeFilename,
  getFrameworkDefaults,
};
