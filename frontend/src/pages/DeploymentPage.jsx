import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
} from '@mui/material';
import FileUpload from '../components/FileUpload';
import { deploymentService } from '../services/deploymentService';
import {
  createDeploymentStart,
  createDeploymentSuccess,
  createDeploymentFailure,
} from '../store/slices/deploymentSlice';

const steps = ['GitHub Repository', 'Configure', 'Deploy'];

function DeploymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [githubUrl, setGithubUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');

  const handleRepoSubmit = ({ githubUrl: url, branch: branchName }) => {
    setGithubUrl(url);
    setBranch(branchName);
    setActiveStep(1);
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      // Validate subdomain
      if (!subdomain) {
        setError('Please enter a subdomain');
        return;
      }
      try {
        const available = await deploymentService.checkSubdomainAvailability(subdomain);
        if (!available.available) {
          setError('Subdomain is already taken');
          return;
        }
        setError('');
        setActiveStep(2);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to check subdomain');
      }
    } else if (activeStep === 2) {
      handleDeploy();
    }
  };

  const handleDeploy = async () => {
    try {
      setDeploying(true);
      setDeploymentStatus('Cloning repository...');
      dispatch(createDeploymentStart());

      const deploymentData = {
        githubUrl,
        branch,
        subdomain,
      };

      setDeploymentStatus('Building project...');
      
      const deployment = await deploymentService.createDeployment(deploymentData);

      setDeploymentStatus('Uploading to IPFS...');
      
      dispatch(createDeploymentSuccess(deployment));
      
      setDeploymentStatus('Deployment successful!');
      
      // Navigate to deployment details after a short delay
      setTimeout(() => {
        navigate(`/deployments/${deployment.id}`);
      }, 1500);
    } catch (err) {
      setDeploying(false);
      const errorMsg = err.response?.data?.message || 'Failed to deploy project';
      setError(errorMsg);
      setDeploymentStatus('');
      dispatch(createDeploymentFailure(errorMsg));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          Deploy to Web3
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Deploy your GitHub repository to the decentralized web
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <FileUpload onRepoSubmit={handleRepoSubmit} />
        )}

        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Repository:</strong> {githubUrl}
              </Typography>
              <Typography variant="body2">
                <strong>Branch:</strong> {branch}
              </Typography>
            </Alert>
            
            <TextField
              label="Subdomain"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              helperText="Your site will be available at [subdomain].yourdomain.com"
              placeholder="my-awesome-app"
              fullWidth
              required
            />
            
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Note:</strong> We&apos;ll automatically detect your framework and run the build process.
                Supported: React, Vue, Angular, Next.js, and more!
              </Typography>
            </Alert>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            {deploying ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {deploymentStatus}
                </Typography>
                <LinearProgress sx={{ my: 3 }} />
                <Typography variant="body2" color="text.secondary">
                  This may take a few minutes depending on your project size...
                </Typography>
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" align="left">
                    <strong>Steps:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="left">
                    ✓ Clone repository from GitHub
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="left">
                    ✓ Detect framework and dependencies
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="left">
                    ⏳ Install dependencies and build
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="left">
                    ⏳ Upload to IPFS
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="left">
                    ⏳ Configure subdomain
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Ready to Deploy!
                </Typography>
                <Box sx={{ mt: 2, p: 3, backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Repository:</strong> {githubUrl}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Branch:</strong> {branch}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Subdomain:</strong> {subdomain}.yourdomain.com
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0 || deploying} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !githubUrl) ||
              (activeStep === 1 && !subdomain) ||
              deploying
            }
          >
            {activeStep === steps.length - 1 ? 'Deploy Now' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default DeploymentPage;
