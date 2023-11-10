import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable,FlatList } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

import { getFriendsRealtimeChange } from '../apis/firebase'

import AddMembersItem from './AddMembersItem'

function AddMembers({pickFriends, setPickFriends, itemKey, showSchedule}){

  const [open, setOpen] = useState(false) //모달 open
  const [friendLists, setFriendLists] = useState() //친구목록 전체 저장
  const [selectedId, setSelectedId] = useState(null)

  console.log('show', showSchedule)


  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setPickFriends('')
    setOpen(false)
  }

  const addMember = () => {
    setOpen(false)
  }

  useEffect(() => {
    //친구목록 데이터 불러오기
    getFriendsRealtimeChange(function onResult(querySnapshot){
      console.log(querySnapshot.data().friends)
      setFriendLists(querySnapshot.data().friends)
    }, 
    function onError(err){
      console.log('err', err)
    })
  },[])
  console.log('pick', pickFriends)

  return(
    <View style={styles.horizontalView}>
      {/* <Text>함께하는 멤버 : {pickFriends !== '' ? pickFriends.map(friend => friend.name.split(', ')) : '없음'}</Text> */}
      <Text>함께하는 멤버 : {pickFriends ? pickFriends.map(friend => friend.name) : showSchedule.map(schedule => schedule.id === itemKey && schedule.members.map(member => member.name))} </Text>
      <TouchableOpacity style={styles.modalBtn} onPress={openModal}>
        <Text style={styles.btnText}>추가</Text>
      </TouchableOpacity>
      <Modal
        animationType='slide'
        transparent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(!open)  
        }}
        onShow={() => {
            console.log('친구리스트', friendLists)
        }}
      >
        <View style={[styles.centerView, styles.modal]}>
          <FlatList
            data={friendLists}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <AddMembersItem item={item} pickFriends={pickFriends} setPickFriends={setPickFriends}/>
            )}
            
          />
          <Pressable onPress={addMember}><Text>등록</Text></Pressable>
          <Pressable onPress={closeModal}><Text>닫기</Text></Pressable>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  horizontalView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtn: {
    padding: 8,
    width: 50,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'lightgreen',
  },
  btnText: {
    fontSize: 12,
    textAlign: 'center',
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'lightgreen',
    justifyContent: 'center',
    alignItems:'center',
    elevation: 2,
  },
})

export default AddMembers