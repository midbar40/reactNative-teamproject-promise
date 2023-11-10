import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'

function AddMembersItem({item, pickFriends, setPickFriends}){
  
  const [pick, setPick] = useState(false)

  useEffect(() => {
    pickFriends.indexOf(item.name) !== -1 && setPick(!pick)
  },[])

  const onPress = () => {
    if(pickFriends.indexOf(item.name) === -1){
      setPickFriends([...pickFriends, item.name])
    }else if(pick){
      //다시 누르면 걸러주기
      const list = pickFriends
      const filterd = list.filter(list =>{
        return list !== item.name
      } 
        )
      setPickFriends(filterd)
    }
    console.log(pickFriends)
    setPick(!pick)
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