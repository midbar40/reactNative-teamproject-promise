import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

import ColorItem from './ColorItem'

function PickColor({pickColor, setPcikColor, }){

  return(
    <View style={styles.horizontalView}>
      <ColorItem title='pink' pickColor={pickColor} setPcikColor={setPcikColor}/>
      <ColorItem title='lightgreen' pickColor={pickColor} setPcikColor={setPcikColor}/>
      <ColorItem title='skyblue' pickColor={pickColor} setPcikColor={setPcikColor}/>
      <ColorItem title='grey' pickColor={pickColor} setPcikColor={setPcikColor}/>
      <ColorItem title='beige' pickColor={pickColor} setPcikColor={setPcikColor}/>
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