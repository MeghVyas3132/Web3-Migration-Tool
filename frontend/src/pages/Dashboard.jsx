import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Grid, Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import DeploymentCard from '../components/DeploymentCard';
import { deploymentService } from '../services/deploymentService';
import {
  fetchDeploymentsStart,
  fetchDeploymentsSuccess,
  fetchDeploymentsFailure,
  deleteDeploymentSuccess,
} from '../store/slices/deploymentSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deployments, loading } = useSelector((state) => state.deployments);

  useEffect(() => {
    loadDeployments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDeployments = async () => {
    try {
      dispatch(fetchDeploymentsStart());
      const data = await deploymentService.getAllDeployments();
      console.log('Deployments loaded:', data); // Debug log
      dispatch(fetchDeploymentsSuccess(data));
    } catch (error) {
      console.error('Error loading deployments:', error);
      dispatch(fetchDeploymentsFailure(error.response?.data?.message || 'Failed to load deployments'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deploymentService.deleteDeployment(id);
      dispatch(deleteDeploymentSuccess(id));
    } catch (error) {
      console.error('Failed to delete deployment:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Your Deployments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your Web3 hosted applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/deploy')}
        >
          New Deployment
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : deployments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No deployments yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get started by deploying your first Web3 application
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/deploy')}
          >
            Create Your First Deployment
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {deployments.map((deployment) => (
            <Grid item xs={12} sm={6} md={4} key={deployment.id}>
              <DeploymentCard deployment={deployment} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Dashboard;
