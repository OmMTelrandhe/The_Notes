import React from 'react'
import Trash from '../icons/Trash'
import { useContext } from 'react'
import { NoteContext } from '../context/NoteContext'

const DeleteButton = ({noteId, onClick}) => {
  const { deleteNote } = useContext(NoteContext);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering other click events
    try {
      await deleteNote(noteId);
      if (onClick) onClick();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div onClick={handleDelete}>
      <Trash/>
    </div>
  )
}

export default DeleteButton