import React from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'

function AddMembersItem({item, pickFriends, setPickFriends}){
  // console.log('item', item)
  

  const onPress = () => {
    if(pickFriends.indexOf(item) === -1){
      setPickFriends([...pickFriends, item])
    }
  }

  return(
    <TouchableOpacity onPress={onPress}>
      <Text>이름: {item.name}</Text>
      <Text>이메일: {item.email}</Text>
    </TouchableOpacity>
  )
}


export default AddMembersItem