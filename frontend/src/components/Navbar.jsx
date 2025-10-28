import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function Navbar() {
  return (
    <AppBar position="sticky" sx={{ background: 'rgba(26, 31, 58, 0.9)', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <RocketLaunchIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          Web3 Migration Tool
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/deploy" variant="outlined">
            Deploy
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
