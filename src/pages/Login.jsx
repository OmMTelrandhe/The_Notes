import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Divider
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from '../context/AuthContext';
import { BackgroundLines } from "../components/background-lines";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email.trim()) {
        setError('Email is required');
        return;
      }
      if (!password.trim()) {
        setError('Password is required');
        return;
      }

      await login(email, password);
      navigate('/'); // Redirect to home page after login
    } catch (err) {
      console.error('Login error:', err);
      
      // More specific error handling
      if (err.code === 'USER_INVALID_CREDENTIALS') {
        setError('Invalid email or password');
      } else if (err.code === 'USER_UNAUTHORIZED') {
        setError('Account not verified. Please check your email.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(); // Use the destructured method directly
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed');
    }
  };
  
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-2" top={-10}>
      <Container 
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 3,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Sign in to StickyNotes
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Divider sx={{ width: "100%", my: 2 }}>
              <Typography color="textSecondary" variant="body2">
                OR
              </Typography>
            </Divider>

            <Button
              variant="contained"
              // color="primary"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ width: "100%", mb: 2 }}
            >
              Login with Google
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </BackgroundLines>
  );
};

export default Login;
