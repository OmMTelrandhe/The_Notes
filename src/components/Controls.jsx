import React from 'react'
import AddButton from './AddButton'
import colors from '../assets/colors.json'
import Color from './Color'
import FontFamilySelector from './FontFamilySelector'


const Controls = () => {
  return (
    <div id="controls">
      <AddButton />

      {colors.map((color) => (
        <Color key={color.id} color={color} />
      ))}

      {/* <FontFamilySelector /> */}
    </div>
  );
}

export default Controls;