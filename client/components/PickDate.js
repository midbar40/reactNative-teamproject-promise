import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'

import PickItem from './PickItem'
import ChatCreateBtn from './ChatCreateBtn'
import { removeSchedule, getThisSchedulesChatRoom, deleteThisSchedulesChatRoom } from '../apis/firebaseCalendar'

function PickDate({selectedDate, loadSchedule, showSchedule, setShowSchedule, setOpenModal, itemKey, setItemKey, navigation, setSelectRoomId, myInfo, pickSchedule }){

  const [title, setTitle] = useState('')
  const [friends, setFriends] = useState('')

  //삭제버튼 클릭
  const clickDelete = () => {
    console.log('삭제', itemKey)
    showSchedule.map((schedule, id) => {
      if(itemKey === schedule.id){
        //해당 스케쥴을 만든사람만 삭제 가능
        if(schedule.createdUser === myInfo.UID){
          Alert.alert('삭제',
          '할일을 삭제하시겠습니까?',
          [{text: '취소', style: 'cancel'},
          {text: '삭제', onPress: () => {
            try{
                // 화면에서도 삭제
                const newSchedule = showSchedule.filter(show => itemKey !== show.id)
                setShowSchedule(newSchedule)
                // firebase 삭제
                removeSchedule('CalendarSchedule', itemKey)
                //채팅방 id 조회
                setItemKey('')
                getThisSchedulesChatRoom(schedule.id)
                .then(result => {
                  console.log(result.docs[0].id)
                  deleteThisSchedulesChatRoom(result.docs[0].id)
                })
                .catch(err => console.log('deletechatroomErr', err))
              }catch(err){console.log('err:', err)}
              
            }}]
          )
        }else{
          Alert.alert('오류','스케쥴을 만든 사람만 삭제 할 수 있습니다.')
        }
      }
    })
  }

  // console.log('show', showSchedule)
  const onRowOpen = (rowKey) => {
    console.log('row open', rowKey)
    setItemKey(rowKey)

    showSchedule.filter(schedule => {
      console.log('스케쥴',schedule)
      //채팅방 멤버 구성
      const memberLists = []
      if(schedule.id === rowKey){
        setTitle(schedule.title) 
        schedule.members && schedule.members.map((member, id) => {
          memberLists.push(member.UID)
        })
        console.log('member',memberLists)
        setFriends(memberLists)
      } 
    })
  }

  const onRowClose = () => {
    setItemKey('')
  }

  const hiddenItem = () => {
    return(
      <>
        <View style={styles.rowBack}>
          <ChatCreateBtn title={title} calendarUID={itemKey} friends={friends} navigation={navigation} setSelectRoomId={setSelectRoomId}/>
        </View>
        <View style={styles.rowBack}>
          <TouchableOpacity style={styles.deleteBtn} onPress={clickDelete}>
            <Text style={[styles.deleteText, styles.font]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

 
  return(
    selectedDate &&
    <SwipeListView
      data={showSchedule}
      style={styles.block}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <PickItem {...item} setItemKey={setItemKey} setOpenModal={setOpenModal} showSchedule={showSchedule}/>
      )}
      renderHiddenItem={hiddenItem}
      rightOpenValue={-70}
      previewRowKey={'0'}
      previewOpenValue={-40}
      previewOpenDelay={1000}
      onRowOpen={onRowOpen}
      onRowClose={onRowClose}
      
    />
  )
}

const styles = StyleSheet.create({
  block:{
    flex: 1,
    backgroundColor: '#fff'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 15,
    height: 0,
  },
  deleteBtn: {
    backgroundColor: 'red',
    right: 0,
    width: 70,
    height: '100%',
    padding: 10,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteText: {
    // fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold'
  },
})


export default PickDate