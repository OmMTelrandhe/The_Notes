import React, { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases";
import { ChromePicker } from "react-color";
import tinycolor from "tinycolor2";

const Color = ({ color }) => {
  const { selectedNote, notes, setNotes } = useContext(NoteContext);
  const [showPalette, setShowPalette] = useState(false);
  const [customColor, setCustomColor] = useState({
    colorHeader: "#FFFFFF",
    colorBody: "#F8F8F8",
    colorText: "#18181A",
  });

  const changeColor = (selectedColor) => {
    try {
      const currentNoteIndex = notes.findIndex(
        (note) => note.$id === selectedNote.$id
      );

      const updatedNote = {
        ...notes[currentNoteIndex],
        colors: JSON.stringify(selectedColor),
      };

      const newNotes = [...notes];
      newNotes[currentNoteIndex] = updatedNote;
      setNotes(newNotes);

      db.notes.update(selectedNote.$id, {
        colors: JSON.stringify(selectedColor),
      });
    } catch (error) {
      alert("You must select a note before changing colors");
    }
  };

  const handleCustomColorChange = (color) => {
    const headerColor = color.hex;
    const bodyColor = tinycolor(headerColor).lighten(15).toHexString(); // Lighten the color by 15%

    setCustomColor({
      colorHeader: headerColor,
      colorBody: bodyColor,
      colorText: tinycolor(headerColor).isLight() ? "#18181A" : "#FFFFFF", // Set text color to contrast the header
    });
  };

  const applyCustomColor = () => {
    changeColor(customColor);
    setShowPalette(false);
  };

  return (
    <div className="color-container">
      {/* Predefined Colors */}
      {color.id !== "custom-color" && (
        <div
          className="color"
          onClick={() => changeColor(color)}
          style={{ backgroundColor: color.colorHeader }}
        ></div>
      )}

      {/* Color Picker Trigger */}
      {color.id === "custom-color" && (
        <div className="color" onClick={() => setShowPalette(!showPalette)}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem", // Adjust the size as per your preference
              fontWeight: "bold", // Makes the plus icon bold
              color: "#18181A", // Set the color for the icon
              backgroundColor: "#F8F8F8", // Optional: Set a background color
              borderRadius: "50%", // Makes it circular
              width: "40px", // Adjust width and height
              height: "40px",
              cursor: "pointer",
            }}
          >
            +
          </span>
        </div>
      )}

      {/* Color Picker Palette */}
      {showPalette && (
        <div className="color-picker">
          <ChromePicker
            color={customColor.colorHeader}
            onChange={handleCustomColorChange}
          />
          <button onClick={applyCustomColor} className="apply-color-btn">
            Apply Color
          </button>
        </div>
      )}
    </div>
  );
};

export default Color;
