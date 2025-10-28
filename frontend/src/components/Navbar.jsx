import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ background: 'rgba(26, 31, 58, 0.9)', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <RocketLaunchIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          Web3 Migration Tool
        </Typography>
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/deploy" variant="outlined">
              Deploy
            </Button>
            <Typography variant="body2" sx={{ mx: 2 }}>
              {user?.username || user?.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="primary" variant="contained" component={Link} to="/register">
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
