import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'

function AddMembersItem({item, pickFriends, setPickFriends, setSelectedId, friendInfo, setFriendInfo}){
  
  const [pick, setPick] = useState(false)

  // 이미 스케쥴에 등록된 친구는 클릭되어있게
  useEffect(() => {
    const friendsName = []
    const friendsUid = []
    friendInfo && friendInfo.map(friend => {
      friendsName.push(friend.name)
      friendsUid.push(friend.UID)
    })
    console.log('name, uid', friendsName, friendsUid)
    pickFriends && friendsUid.indexOf(item.UID) !== -1 && friendsName.indexOf(item.name) !== -1 && setPick(!pick)
  },[])


  //member추가
  const onPress = () => {
    const names = []
    const Uids = []
    console.log(friendInfo)
    if(Uids.indexOf(item.UID) === -1 || friendInfo === []){
        friendInfo && friendInfo.map(friend => {
          names.push(friend.name)
          Uids.push(friend.UID)
        })
        setFriendInfo([...friendInfo, {
          name: item.name,
          UID: item.UID
        }])
        if(pick){
          const filtered = friendInfo.filter(list => {
            return list.UID !== item.UID && list.name !== item.UID
          })
          setFriendInfo(filtered)
        }
      }
    setPick(!pick)
  }

  return(
    <TouchableOpacity onPress={onPress} style={[styles.container, pick ? styles.pick : '']}>
      <Text style={styles.font}>이름: {item.name}</Text>
      <Text style={styles.font}>이메일: {item.email}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#BDEDD2',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  pick: {
    backgroundColor: '#BDEDD2',
    elevation: 2,
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold'
  },
})

export default AddMembersItem