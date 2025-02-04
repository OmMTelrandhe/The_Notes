import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { databases, collections } from '../appwrite/config';
import { Query } from 'appwrite';

export const NoteContext = createContext(null);

const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch existing notes for the user
      const notesResponse = await databases.listDocuments(
        collections[0].dbId,
        collections[0].id,
        [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
      );
      
      // Ensure notes are always fetched and set
      setNotes(notesResponse.documents);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError(err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = async (noteData) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const newNote = await databases.createDocument(
        collections[0].dbId,
        collections[0].id,
        'unique()',
        {
          ...noteData,
          userId: user.$id
        }
      );

      // Immediately update local state to reflect database change
      setNotes(prevNotes => [...prevNotes, newNote]);
      return newNote;
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  };

  const updateNote = async (noteId, updatedData) => {
    try {
      const updatedNote = await databases.updateDocument(
        collections[0].dbId,
        collections[0].id,
        noteId,
        updatedData
      );

      // Immediately update local state to reflect database change
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.$id === noteId ? updatedNote : note
        )
      );

      return updatedNote;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await databases.deleteDocument(
        collections[0].dbId,
        collections[0].id,
        noteId
      );

      // Immediately update local state to reflect database change
      setNotes(prevNotes => prevNotes.filter(note => note.$id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };

  return (
    <NoteContext.Provider value={{
      notes, 
      setNotes, 
      loading, 
      error, 
      selectedNote, 
      setSelectedNote,
      addNote,
      updateNote,
      deleteNote,
      fetchNotes
    }}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider;