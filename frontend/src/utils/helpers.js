export const detectFramework = (files) => {
  const hasFile = (filename) => files.some(f => f.name === filename);
  
  if (hasFile('package.json')) {
    // Framework detection now happens on the backend
    // This function is kept for client-side validation
    return 'auto-detect'; // Backend will detect
  }
  
  if (hasFile('index.html')) {
    return 'html';
  }
  
  return 'other';
};

export const validateSubdomain = (subdomain) => {
  const regex = /^[a-z0-9-]+$/;
  return regex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 63;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const truncateString = (str, maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const getFrameworkBuildCommand = (framework) => {
  const commands = {
    react: 'npm run build',
    vue: 'npm run build',
    nextjs: 'npm run build && npm run export',
    angular: 'npm run build',
    html: '',
  };
  
  return commands[framework] || 'npm run build';
};
