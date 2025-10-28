import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { deploymentService } from '../services/deploymentService';

function DeploymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeployment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDeployment = async () => {
    try {
      const data = await deploymentService.getDeploymentById(id);
      setDeployment(data);
    } catch (error) {
      console.error('Failed to load deployment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this deployment?')) {
      try {
        await deploymentService.deleteDeployment(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to delete deployment:', error);
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!deployment) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Deployment not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {deployment.subdomain}.web3host.xyz
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={deployment.framework} color="primary" variant="outlined" />
              <Chip
                label={deployment.status}
                color={deployment.status === 'active' ? 'success' : 'warning'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Deployed on {format(new Date(deployment.createdAt), 'MMMM dd, yyyy at HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<OpenInNewIcon />}
              href={`https://${deployment.subdomain}.web3host.xyz`}
              target="_blank"
            >
              Visit Site
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Deployment Info
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    IPFS CID
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 2 }}>
                    {deployment.ipfsCID}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    IPFS Gateway URL
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 2 }}>
                    https://ipfs.io/ipfs/{deployment.ipfsCID}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Framework
                  </Typography>
                  <Typography variant="body1">{deployment.framework}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Uptime
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {deployment.metrics?.uptime || 99.9}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Visits
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {deployment.metrics?.totalVisits || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Pinged
                    </Typography>
                    <Typography variant="body1">
                      {deployment.metrics?.lastPinged
                        ? format(new Date(deployment.metrics.lastPinged), 'MMM dd, HH:mm')
                        : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default DeploymentDetails;
