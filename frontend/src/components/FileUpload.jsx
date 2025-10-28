import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField,
  Button,
  Alert,
  Link
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import PropTypes from 'prop-types';

function FileUpload({ onRepoSubmit }) {
  const [githubUrl, setGithubUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate GitHub URL
    const githubPattern = /^(https?:\/\/)?(www\.)?(github\.com)\/[\w-]+\/[\w.-]+/i;
    const gitPattern = /^git@github\.com:[\w-]+\/[\w.-]+\.git$/i;
    
    if (!githubPattern.test(githubUrl) && !gitPattern.test(githubUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    onRepoSubmit({ githubUrl, branch });
  };

  return (
    <Paper
      sx={{
        p: 4,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'grey.700',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <GitHubIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h6" gutterBottom>
            Deploy from GitHub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your GitHub repository URL to deploy
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="GitHub Repository URL"
          placeholder="https://github.com/username/repository"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          required
          sx={{ mb: 2 }}
          helperText="Example: https://github.com/username/my-react-app"
        />

        <TextField
          fullWidth
          label="Branch"
          placeholder="main"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          sx={{ mb: 3 }}
          helperText="Default: main (or master)"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!githubUrl}
          sx={{
            py: 1.5,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #667eea 60%, #764ba2 120%)',
            },
          }}
        >
          Deploy from GitHub
        </Button>
      </Box>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Supported Formats:</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • https://github.com/username/repo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • git@github.com:username/repo.git
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Note:</strong> Your repository must be public or you must have access to it.
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Need help? Check out our{' '}
          <Link href="#" color="primary">
            deployment guide
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}

FileUpload.propTypes = {
  onRepoSubmit: PropTypes.func.isRequired,
};

export default FileUpload;
