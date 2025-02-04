import { useRef, useEffect, useState } from "react";
import { db } from "../appwrite/databases.js";
import DeleteButton from "./DeleteButton.jsx";
import Spinner from "../icons/spinner.jsx";
import Copy from "../icons/Copy.jsx";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils.js";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext.jsx";

const NoteCard = ({ note }) => {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const keyUpTimer = useRef(null);

  const { deleteNote, setSelectedNote } = useContext(NoteContext);

  const body = bodyParser(note.body);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);
  const [fontFamily, setFontFamily] = useState(note.fontFamily || "Arial"); // Default to Arial if not set

  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = useRef(null);

  const textAreaRef = useRef(null);

  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      setZIndex(cardRef.current);

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      setSelectedNote(note);
    }
  };

  const mouseMove = (e) => {
    const mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  };

  const mouseUp = async () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    saveData("position", newPosition);
  };

  const saveData = async (key, value) => {
    const payload = {
      [key]: typeof value === "string" ? value : JSON.stringify(value),
    };

    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error("Error saving data:", error);
    }
    setSaving(false);
  };

  const handleFontChange = async (e) => {
    const newFontFamily = e.target.value;
    setFontFamily(newFontFamily);
    setSaving(true);
    await saveData("fontFamily", newFontFamily);
  };

  const handleKeyUp = () => {
    setSaving(true);

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  const handleDelete = async () => {
    try {
      // Immediately remove the note from UI
      await deleteNote(note.$id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleCopyToClipboard = () => {
    if (textAreaRef.current) {
      navigator.clipboard.writeText(textAreaRef.current.value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        style={{
          backgroundColor: colors.colorHeader,
          fontFamily: fontFamily,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onMouseDown={mouseDown}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DeleteButton onClick={handleDelete} noteId={note.$id} />
          {saving && (
            <div className="card-saving" style={{ marginLeft: "10px" }}>
              <Spinner color={colors.colorText} />
              <span style={{ color: colors.colorText }}>Saving...</span>
            </div>
          )}
          <button 
            onClick={handleCopyToClipboard} 
            style={{ 
              marginLeft: "10px", 
              backgroundColor: copied ? "#4CAF50" : "transparent", 
              color: copied ? "white" : colors.colorText, 
              border: "none", 
              padding: "5px", 
              borderRadius: "4px", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.3s ease"
            }}
            title="Copy to Clipboard"
          >
            <Copy color={copied ? "white" : colors.colorText} />
          </button>
        </div>
        <select
          value={fontFamily} // Reflects the saved font family
          onChange={handleFontChange}
          style={{
            fontFamily: fontFamily,
            padding: "4px",
            border: "none",
            borderRadius: "4px",
          }}
        >
          <option value="Arial" style={{ fontFamily: "Arial" }}>
            Arial
          </option>
          <option value="Georgia" style={{ fontFamily: "Georgia" }}>
            Georgia
          </option>
          <option
            value="Times New Roman"
            style={{ fontFamily: "Times New Roman" }}
          >
            Times New Roman
          </option>
          <option value="Courier New" style={{ fontFamily: "Courier New" }}>
            Courier New
          </option>
          <option value="Verdana" style={{ fontFamily: "Verdana" }}>
            Verdana
          </option>
        </select>
      </div>

      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
          ref={textAreaRef}
          style={{ color: colors.colorText, fontFamily: fontFamily }}
          defaultValue={body}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
