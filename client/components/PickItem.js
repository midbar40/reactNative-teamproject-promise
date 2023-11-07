import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function PickItem({ title, content, startDay, endDay }){

  return(
    <View style={styles.content}>
      <Text>제목 : {title}</Text>
      <Text>내용 : {content}</Text>
      {/* <Text>멤버 : {members}</Text> */}
      <Text>{startDay}  ~  {endDay}</Text>
    </View>
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