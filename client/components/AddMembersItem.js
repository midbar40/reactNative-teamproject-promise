import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'

function AddMembersItem({item, selectedId, setSelectedId}){
  
  const [pick, setPick] = useState(false)

  //이미 스케쥴에 등록된 친구는 클릭되어있게
  useEffect(() => {
    selectedId && selectedId.indexOf(item.name) !== -1 && setPick(!pick)
  },[])


  //member추가
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