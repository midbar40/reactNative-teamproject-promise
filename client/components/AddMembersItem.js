import React, { useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'

function AddMembersItem({item, pickFriends, setPickFriends}){
  // console.log('item', item)
  
  const [pick, setPick] = useState(false)

  const onPress = () => {
    setPick(!pick)
    if(pickFriends.indexOf(item) === -1){
      setPickFriends([...pickFriends, item])
    }
  }

  return(
    <TouchableOpacity onPress={onPress} style={[styles.container, pick ? styles.pick : '']}>
      <Text>이름: {item.name}</Text>
      <Text>이메일: {item.email}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'lightgreen',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  pick: {
    backgroundColor: 'lightgreen',
    elevation: 2,
  }
})

export default AddMembersItem