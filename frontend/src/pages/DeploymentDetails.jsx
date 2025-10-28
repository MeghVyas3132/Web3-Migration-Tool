import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Grid, Chip, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
import { deploymentService } from '../services/deploymentService';

function DeploymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDeployment = async () => {
    try {
      setLoading(true);
      const data = await deploymentService.getDeployment(id);
      setDeployment(data);
      setError('');
    } catch (err) {
      setError('Failed to load deployment details');
      console.error('Error loading deployment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeployment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!deployment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Deployment not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Deployments
        </Button>
      </Container>
    );
  }

  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${deployment.ipfsCID}`;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
        Back to Deployments
      </Button>

      <Paper sx={{ p: 4, mb: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Typography variant="h4" gutterBottom fontWeight="bold">
          Deployment Details
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={deployment.status || 'Active'}
              color={deployment.status === 'active' ? 'success' : 'default'}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Framework
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {deployment.framework || 'Unknown'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              GitHub Repository
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {deployment.githubUrl}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Branch
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {deployment.branch || 'main'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              IPFS Hash (CID)
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                p: 1,
                borderRadius: 1,
                wordBreak: 'break-all',
              }}
            >
              {deployment.ipfsCID}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Access Your Site
            </Typography>
            <Card sx={{ backgroundColor: 'rgba(102, 126, 234, 0.1)' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your site is available through IPFS:
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<LinkIcon />}
                  href={ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Open Site
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Created
            </Typography>
            <Typography variant="body2" fontWeight="500">
              {deployment.createdAt ? new Date(deployment.createdAt).toLocaleString() : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default DeploymentDetails;
