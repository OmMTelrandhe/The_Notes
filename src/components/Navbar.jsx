import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <StickyNote2Icon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            StickyNotes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              Hi, {user.name || 'User'}
            </Typography>
          )}
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
