import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

function ColorItem({title, pickColor, setPcikColor, showSchedule}){
  
  useEffect(() => {
    showSchedule.map(schedule => {
      // console.log(schedule.pickColor)
      setPcikColor(schedule.pickColor)
    })
  },[])

  const setColor = () => {
    console.log('내가고른색', title)
    setPcikColor(title)
  }
 

  return(
    <>
      <Pressable style={[styles.circle, {backgroundColor: `${title}`}, (title === pickColor) ? styles.pick : '']} onPress={setColor}/>
    </>
  )
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 50,
    width: 20,
    height: 20,
    marginHorizontal:5,
  },  
  pick: {
    borderRadius: 50,
    width: 22,
    height:22,
    borderColor: '#333',
    borderWidth: 2,
  }
})

export default ColorItem