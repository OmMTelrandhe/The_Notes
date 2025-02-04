import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import NoteContainer from '../components/NoteContainer';
import { useAuth } from '../context/AuthContext';
import { authService } from '../appwrite/config';
import { Backdrop, CircularProgress } from '@mui/material';

const NotesPage = () => {
  const { user, setUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndCreateUser = async () => {
      try {
        // Check if there's a pending Google signup
        const googleSignupPending = localStorage.getItem('googleSignupPending');
        const isNewUserSignup = localStorage.getItem('isNewUserSignup');
        
        if ((googleSignupPending === 'true' || isNewUserSignup === 'true') && user) {
          // Attempt to create user document
          await authService.createUserAfterGoogleSignup(user);
          
          // Clear the pending flags
          localStorage.removeItem('googleSignupPending');
          localStorage.removeItem('isNewUserSignup');
        }
      } catch (error) {
        console.error("Error creating user after Google signup:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkAndCreateUser();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <Backdrop 
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0,0,0,0.8)' 
        }} 
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      background: 'linear-gradient(#292a30 0.2em, transparent 0.2em), linear-gradient(90deg,rgb(36, 37, 41) 0.2em, transparent 0.2em)', 
      backgroundSize: '4em 4em' 
    }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', marginTop: '64px'}}>
        <NoteContainer 
          notes={notes} 
          setNotes={setNotes} 
          selectedNote={selectedNote} 
          setSelectedNote={setSelectedNote} 
        />
      </div>
    </div>
  );
};

export default NotesPage;