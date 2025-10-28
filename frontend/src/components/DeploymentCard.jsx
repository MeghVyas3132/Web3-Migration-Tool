import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

function DeploymentCard({ deployment, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'building':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this deployment?')) {
      onDelete(deployment.id);
    }
  };

  return (
    <Card
      component={Link}
      to={`/deployments/${deployment.id}`}
      sx={{
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {deployment.subdomain}.web3host.xyz
            </Typography>
            <Chip
              label={deployment.framework}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip
              label={deployment.status}
              size="small"
              color={getStatusColor(deployment.status)}
            />
          </Box>
          <Box>
            <IconButton
              size="small"
              href={`https://${deployment.subdomain}.web3host.xyz`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <OpenInNewIcon />
            </IconButton>
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          IPFS CID: {deployment.ipfsCID?.substring(0, 20)}...
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Deployed: {format(new Date(deployment.createdAt), 'MMM dd, yyyy')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Uptime: {deployment.metrics?.uptime || 99.9}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

DeploymentCard.propTypes = {
  deployment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subdomain: PropTypes.string.isRequired,
    ipfsCID: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    framework: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    metrics: PropTypes.shape({
      uptime: PropTypes.number,
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeploymentCard;
