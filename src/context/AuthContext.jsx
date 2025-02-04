import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, account } from "../appwrite/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setError(null);
      } catch (error) {
        console.error("Failed to get current user:", error);
        setUser(null);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Attempt to delete any existing sessions first
      try {
        await authService.logout();
      } catch (logoutError) {
        // Ignore errors if no session exists
        console.log("No existing session to logout:", logoutError);
      }

      // Login and get session
      const session = await authService.login(email, password);
      
      // Fetch current user after successful login
      const loggedInUser = await authService.getCurrentUser();
      setUser(loggedInUser);
      
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      
      const newUser = await authService.signup(email, password, name);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Attempt to delete any existing sessions first
      try {
        await authService.logout();
      } catch (logoutError) {
        console.log("No existing session to logout:", logoutError);
      }

      // Store additional metadata for new user handling
      localStorage.setItem('googleSignupPending', 'true');
      localStorage.setItem('isNewUserSignup', 'true');

      // Create Google OAuth2 session with a success and failure callback
      await account.createOAuth2Session(
        'google', 
        window.location.origin + '/', // Redirect to notes page after successful signup
        window.location.origin + '/login'  // Redirect to login on failure
      );
    } catch (error) {
      console.error("Google login error:", error);
      setError(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      loginWithGoogle,
      loading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return { ...context, loginWithGoogle: context.loginWithGoogle };
};
