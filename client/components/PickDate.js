import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'

import PickItem from './PickItem'
import { removeSchedule } from '../apis/firebaseCalendar'

function PickDate({selectedDate, setSelectedDate, showSchedule, setShowSchedule, setOpenModal, itemKey, setItemKey}){

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
          }catch(err){console.log('err:', err)}
        }}
      ]
    )
  }

  const onRowOpen = (rowKey) => {
    console.log('row open', rowKey)
    setItemKey(rowKey)
  }

  const onRowClose = () => {
    setItemKey('')
  }

  const hiddenItem = () => {
    return(
      <View style={styles.rowBack}>
        <TouchableOpacity style={styles.deleteBtn} onPress={clickDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingLeft: 15,
    height: 0,
  },
  deleteBtn: {
    backgroundColor: 'red',
    right: 0,
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
  }
})


export default PickDate