import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable,FlatList } from 'react-native'

import { getFriendsRealtimeChange } from '../apis/firebase'

import AddMembersItem from './AddMembersItem'


function AddMembers({pickFriends, setPickFriends, itemKey, showSchedule, myInfo}){

  const [open, setOpen] = useState(false) //모달 open
  const [friendLists, setFriendLists] = useState() //친구목록 전체 저장
  const [friendInfo, setFriendInfo] = useState([]) //친구목록 이름, UID 저장용
  const [selectedId, setSelectedId] = useState('') //선택 친구 이름 저장

  // console.log('show', showSchedule)


  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const addMember = () => {
    const list = []
    const notFriendsList = []
    itemKey === '' ? list.push(myInfo) : ''

    const final =  friendInfo && friendInfo.filter(flist => {
      const filtered = friendLists.filter(info => {
        return info.UID !== flist.UID && info.UID !== myInfo.UID && flist.UID !== myInfo.UID && notFriendsList.push(info)
      })
      return filtered
    })
    friendInfo ? list.push(...final) : ''
    console.log('함께하는 멤버:', list)
    final ? setPickFriends(list) : setPickFriends(myInfo)
    
    //이름만 담기
    const arr =[]
    list && list.map(l => {
      arr.push(l.name)
    })
    setSelectedId(arr)
    setOpen(false)
  }

  useEffect(() => {
    //친구목록 데이터 불러오기
    getFriendsRealtimeChange(function onResult(querySnapshot){
      setFriendLists(querySnapshot.data().friends)
    }, 
    function onError(err){
      console.log('err', err)
    })
  },[])

  //스케쥴에 이미 있는 친구 자동으로 데이터 넣기
  useEffect(() => {
    showSchedule.map(schedule => {
        if(schedule.id === itemKey){
          const list = []
          const memberLists = []
          schedule.members && schedule.members.map(member => {
            list.push({name: member.name, UID: member.UID})
            memberLists.push(member)
          })
          setFriendInfo(list)
          const arr =[]
          list.map(l => {
            arr.push(l.name)
          })
          setSelectedId(arr)
          setPickFriends(memberLists)
        }
    })
  },[])

  return(
    <View style={styles.horizontalView}>
      <Text style={[styles.memberContainer, styles.font]}>함께하는 멤버 : {selectedId ? selectedId.join(', ') : ''} </Text>
      <TouchableOpacity style={styles.modalBtn} onPress={openModal}>
        <Text style={[styles.btnText, styles.font]}>추가</Text>
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
            keyExtractor={(item) => item.UID}
            renderItem={({item}) => (
              <AddMembersItem item={item} pickFriends={pickFriends} setPickFriends={setPickFriends} setSelectedId={setSelectedId} friendInfo={friendInfo} setFriendInfo={setFriendInfo}/>
            )}
            style={styles.lists}
          />
          <View style={styles.horizontalView}>
            <Pressable style={[styles.modalBtn]} onPress={addMember}><Text style={styles.font}>등록</Text></Pressable>
            <Pressable style={[styles.modalBtn, styles.closeBtn]} onPress={closeModal}><Text style={styles.font}>닫기</Text></Pressable>
          </View>
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
    backgroundColor: '#BDEDD2',
  },
  btnText: {
    fontSize: 12,
    textAlign: 'center',
  },
  centerView: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BDEDD2',
    justifyContent: 'center',
    alignItems:'center',
    elevation: 2,
  },
  lists: {
    marginBottom: 10,
  },
  closeBtn: {
    backgroundColor: '#ddd'
  },
  memberContainer: {
    width: 220,
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold'
  },
})

export default AddMembers