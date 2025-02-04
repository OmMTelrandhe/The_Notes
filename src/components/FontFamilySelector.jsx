import React, { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases";

const fontFamilies = [
  "Arial",
  "Georgia",
  "Courier New",
  "Verdana",
  "Times New Roman",
  "Roboto",
  "Poppins",
  "Montserrat",
];

const FontFamilySelector = () => {
  const { selectedNote, notes, setNotes } = useContext(NoteContext);
  const [selectedFontFamily, setSelectedFontFamily] = useState("Arial");

  const handleFontFamilyChange = (e) => {
    const newFontFamily = e.target.value;
    setSelectedFontFamily(newFontFamily);

    if (selectedNote) {
      const currentNoteIndex = notes.findIndex(
        (note) => note.$id === selectedNote.$id
      );

      const updatedNote = {
        ...notes[currentNoteIndex],
        fontFamily: newFontFamily,
      };

      const newNotes = [...notes];
      newNotes[currentNoteIndex] = updatedNote;
      setNotes(newNotes);

      // Update the font family in the database
      db.notes.update(selectedNote.$id, { fontFamily: newFontFamily });
    } else {
      alert("You must select a note before changing font family.");
    }
  };

  return (
    <div style={{ marginTop: "1rem", textAlign: "center" }}>
      <label
        htmlFor="font-family-selector"
        style={{ marginRight: "0.5rem", fontWeight: "bold", fontSize: "1rem" }}
      >
        Font Family:
      </label>
      <select
        id="font-family-selector"
        value={selectedFontFamily}
        onChange={handleFontFamilyChange}
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        {fontFamilies.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontFamilySelector;
