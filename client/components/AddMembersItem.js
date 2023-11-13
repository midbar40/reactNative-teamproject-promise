import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'

function AddMembersItem({item, pickFriends, setPickFriends, selectedId, setSelectedId}){
  
  const [pick, setPick] = useState(false)

  //이미 스케쥴에 등록된 친구는 클릭되어있게
  useEffect(() => {
    pickFriends.indexOf(item.name) !== -1 && setPick(!pick)
  },[])

  console.log('item',item)
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