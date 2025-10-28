import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DeploymentPage from './pages/DeploymentPage';
import DeploymentDetails from './pages/DeploymentDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/deploy"
          element={
            <PrivateRoute>
              <DeploymentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/deployments/:id"
          element={
            <PrivateRoute>
              <DeploymentDetails />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Box>
  );
}

export default App;
