import Plus from "../icons/Plus"
import colors from "../assets/colors.json"
import { useRef, useContext } from "react"
import { NoteContext } from "../context/NoteContext"

const AddButton = () => {
  const { addNote } = useContext(NoteContext)
  const startingPos = useRef(10)  

  const handleAddNote = async () => {
    const payload = {
      position: JSON.stringify({ 
        x: startingPos.current,
        y: startingPos.current, 
      }),
      colors: JSON.stringify(colors[0])
    };

    startingPos.current += 10;
    await addNote(payload);
  }

  return (
    <div id="add-btn" onClick={handleAddNote}>
      <Plus/>
    </div>
  )
}

export default AddButton