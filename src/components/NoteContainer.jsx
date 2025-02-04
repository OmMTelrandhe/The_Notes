import React, { useContext } from 'react';
import NoteCard from './NoteCard';
import Controls from './Controls';
import { NoteContext } from '../context/NoteContext';

const NoteContainer = () => {
  const { notes } = useContext(NoteContext);

  return (
    <div className="p-8 relative min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {notes.map((note) => (
          <NoteCard key={note.$id} note={note} />
        ))}
      </div>
      <Controls />
    </div>
  );
};

export default NoteContainer;
