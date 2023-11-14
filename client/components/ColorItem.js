import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

function ColorItem({title, pickColor, setPickColor, showSchedule}){
  
  //스케쥴 수정시 전에 골랐던 색 자동 담기
  useEffect(() => {
    showSchedule ?
    showSchedule.map(schedule => {
      // console.log(schedule.pickColor)
      setPickColor(schedule.pickColor)
    })
    :
    setPickColor('pink')
  },[])

  const setColor = () => {
    console.log('내가고른색', title)
    setPickColor(title)
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