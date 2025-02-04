import React, { useState, useContext } from "react";
import { SketchPicker } from "react-color";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases"; // Assuming your appwrite is set up properly

const ColorPicker = () => {
  const { selectedNote, notes, setNotes } = useContext(NoteContext);
  const [color, setColor] = useState("#ffffff"); // Default color (can be set to current color of the note)
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Toggle the visibility of the color picker

  const predefinedColors = [
    { name: "Yellow", color: "#FFEFBE" },
    { name: "Green", color: "#AFDA9F" },
    { name: "Blue", color: "#9BD1DE" },
    { name: "Purple", color: "#FED0FD" },
    { name: "Red", color: "#FF0000" },
    { name: "White", color: "#FFFFFF" },
  ];

  const handleChangeComplete = (color) => {
    setColor(color.hex); // Update the selected color in state
  };

  const changeColor = () => {
    try {
      const currentNoteIndex = notes.findIndex((note) => note.$id === selectedNote.$id);

      const updatedNote = {
        ...notes[currentNoteIndex],
        colors: JSON.stringify({ colorHeader: color }), // Save the color object
      };

      const newNotes = [...notes];
      newNotes[currentNoteIndex] = updatedNote;
      setNotes(newNotes);

      // Save to the database (update the selected note's color)
      db.notes.update(selectedNote.$id, { colors: JSON.stringify({ colorHeader: color }) });
    } catch (error) {
      alert("You must select a note before changing colors");
    }
  };

  const handleColorClick = (color) => {
    setColor(color); // Set the selected predefined color
    setIsPickerVisible(true); // Show the color picker after selecting a predefined color
  };

  return (
    <div>
      <h3>Select Color</h3>
      
      {/* Display predefined colors */}
      <div className="predefined-colors">
        {predefinedColors.map((colorOption, index) => (
          <div
            key={index}
            className="color-option"
            style={{ backgroundColor: colorOption.color }}
            onClick={() => handleColorClick(colorOption.color)}
          ></div>
        ))}
      </div>

      {/* Show color picker when a predefined color is clicked */}
      {isPickerVisible && (
        <div className="color-picker-container">
          <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
          <button onClick={changeColor} style={{ marginTop: "10px" }}>
            Change Color
          </button>
        </div>
      )}

      {/* Display the selected color */}
      <div
        style={{
          marginTop: "10px",
          width: "100px",
          height: "100px",
          backgroundColor: color,
          border: "1px solid #ccc",
        }}
      >
        Selected Color
      </div>
    </div>
  );
};

export default ColorPicker;
