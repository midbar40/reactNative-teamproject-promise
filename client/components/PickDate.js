import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'

import PickItem from './PickItem'
import ChatCreateBtn from './ChatCreateBtn'
import { removeSchedule } from '../apis/firebaseCalendar'

function PickDate({selectedDate, setSelectedDate, showSchedule, setShowSchedule, setOpenModal, itemKey, setItemKey, navigation, setSelectRoomId, }){

  const [title, setTitle] = useState('')
  const [friends, setFriends] = useState('')

  const clickDelete = () => {
    console.log('삭제', itemKey)
    Alert.alert('삭제',
      '할일을 삭제하시겠습니까?', 
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: () => {
          try{
            removeSchedule('CalendarSchedule', itemKey)
            //화면에서도 삭제
            const newSchedule = showSchedule.filter(show => itemKey !== show.id)
            setShowSchedule(newSchedule)
            setItemKey('')
          }catch(err){console.log('err:', err)}
        }}
      ]
    )
  }

  // console.log('show', showSchedule)
  const onRowOpen = (rowKey) => {
    console.log('row open', rowKey)
    setItemKey(rowKey)

    showSchedule.filter(schedule => {
      //채팅방 멤버 구성
      const memberLists = []
      if(schedule.id === rowKey){
        setTitle(schedule.title) 
        memberLists.push(schedule.createdUser)
        schedule.members && schedule.members.map(member => {
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
            <Text style={styles.deleteText}>Delete</Text>
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
        <PickItem {...item} itemKey={itemKey} setItemKey={setItemKey} setOpenModal={setOpenModal}/>
      )}
      renderHiddenItem={hiddenItem}
      rightOpenValue={-70}
      previewRowKey={'0'}
      previewOpenValue={-40}
      previewOpenDelay={1000}
      onRowOpen={onRowOpen}
      onRowClose={onRowClose}
      
    />

    // <ScrollView style={styles.block} onTouchStart={onTouchStart}>
    //   {showSchedule.map((show,id) => {
    //     return(
    //       <View style={styles.content} key={id}>
    //         <Text>제목 : {show.title}</Text>
    //         <Text>내용 : {show.content}</Text>
    //         {/* <Text>멤버 : {show.members}</Text> */}
    //         <Text>{show.startDay}  ~  {show.endDay}</Text>
    //       </View>  
    //     )
    //   })
    //   }
    // </ScrollView>
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
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
})


export default PickDate