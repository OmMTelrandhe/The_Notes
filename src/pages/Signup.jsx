import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Paper, 
  Link as MuiLink, 
  IconButton, 
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BackgroundLines } from "../components/background-lines";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else {
      // Additional password strength checks
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /[0-9]/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = {...prevErrors};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/'); // Redirect to home page after successful signup
    } catch (err) {
      // More specific error handling
      const errorMessage = err.message || 'Failed to create an account';
      setGlobalError(errorMessage);
      console.error(err);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign up with Google';
      setGlobalError(errorMessage);
      console.error(err);
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
          elevation={6}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            borderRadius: 3,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Create a New Account
          </Typography>

          {globalError && (
            <Box
              sx={{
                width: "100%",
                bgcolor: "error.light",
                color: "error.contrastText",
                p: 2,
                borderRadius: 2,
                mb: 2,
                textAlign: "center",
              }}
            >
              {globalError}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              // color="primary"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                // textTransform: 'none',
                // fontWeight: 'bold'
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Divider sx={{ width: "100%", my: 2 }}>
            <Typography color="textSecondary" variant="body2">
              OR
            </Typography>
          </Divider>

          <Button
            variant="contained"
            // color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            sx={{ width: "100%", mb: 2 }}
          >
            Sign up with Google
          </Button>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <MuiLink component={RouterLink} to="/login" color="primary">
              Log in
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </BackgroundLines>
  );
};

export default Signup;
