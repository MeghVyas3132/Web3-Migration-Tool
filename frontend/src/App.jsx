import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DeploymentPage from './pages/DeploymentPage';
import DeploymentDetails from './pages/DeploymentDetails';

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/deploy" element={<DeploymentPage />} />
        <Route path="/deployments/:id" element={<DeploymentDetails />} />
      </Routes>
    </Box>
  );
}

export default App;
