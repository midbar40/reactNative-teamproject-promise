import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

function PickItem({ title, content, startDay, endDay, itemKey }){

  const longPress = () => {
    console.log('길게누르기', itemKey)
  }

  return(
    <Pressable onLongPress={longPress}>
      <View style={styles.content}>
        <Text>제목 : {title}</Text>
        <Text>내용 : {content}</Text>
        {/* <Text>멤버 : {members}</Text> */}
        <Text>{startDay}  ~  {endDay}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgreen',
    padding: 10,
    backgroundColor: '#fff'
  }
})

export default PickItem