import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'

function AddMembersItem({item, pickFriends, setPickFriends, selectedId, setSelectedId}){
  
  const [pick, setPick] = useState(false)

  //이미 스케쥴에 등록된 친구는 클릭되어있게
  useEffect(() => {
    selectedId && selectedId.indexOf(item.name) !== -1 && setPick(!pick)
  },[])

  console.log('pickfreinds', pickFriends)
  console.log('selec', selectedId)
  console.log('item',item)

  //member추가
  // const onPress = () => {
  //   console.log('pickfr', pick)
  //   if(pick){
  //     //다시 누르면 걸러주기 (체크해제)
      
  //     console.log('1', pick)
  //     const list = pickFriends
  //     // const filterd = list.filter(list =>{
  //       //   return list !== item.name
  //       // })
  //       // setPickFriends(filterd)
  //     }else if(selectedId !== '' && selectedId.indexOf(item.name) === -1){
  //     const picklist = pickFriends ? [...pickFriends] : []
  //     console.log('2')
  //     picklist.push(...picklist, item)
  //     console.log('list',picklist)
  //     setSelectedId(picklist)
  //     console.log('-----',selectedId)
  //     // setPickFriends(list)
  //   }else{
  //     console.log('첫추가')
  //     picklist.push(item)
  //   }
  //   setPick(!pick)
  // }
  const onPress = () => {
    if(selectedId.indexOf(item.name) === -1 || selectedId=== ''){
      setSelectedId([...selectedId, item.name])
    }else if(pick){
      //다시 누르면 걸러주기
      const list = selectedId
      const filterd = list.filter(list =>{
        return list !== item.name
      } 
        )
        setSelectedId(filterd)
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