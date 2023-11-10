import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

import ColorItem from './ColorItem'

function PickColor({pickColor, setPcikColor, showSchedule }){

  console.log('show', showSchedule)

  return(
    <View style={styles.horizontalView}>
      <ColorItem title='pink' pickColor={pickColor} setPcikColor={setPcikColor} showSchedule={showSchedule}/>
      <ColorItem title='lightgreen' pickColor={pickColor} setPcikColor={setPcikColor} showSchedule={showSchedule}/>
      <ColorItem title='skyblue' pickColor={pickColor} setPcikColor={setPcikColor} showSchedule={showSchedule}/>
      <ColorItem title='grey' pickColor={pickColor} setPcikColor={setPcikColor} showSchedule={showSchedule}/>
      <ColorItem title='red' pickColor={pickColor} setPcikColor={setPcikColor} showSchedule={showSchedule}/>
    </View>
  )
}

const styles = StyleSheet.create({
  horizontalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },

})

export default PickColor