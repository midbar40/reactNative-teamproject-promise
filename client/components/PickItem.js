import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

import { updateData } from '../apis/firebaseCalendar'



function PickItem({ title, content, startDay, endDay, id, members, itemKey, setItemKey, setOpenModal}){

  const [memberList, setmemberList] = useState('')

  const longPress = () => {
    console.log('길게누르기', id)
    setItemKey(id)
    setOpenModal(true)
    console.log(memberList)
  }

  useEffect(() => {
    const list = []
    members && members.map(member => {
      list.push(member.name)
    })
    console.log('뭐지', list)
    setmemberList(list)
  },[])

  return(
    <Pressable onLongPress={longPress}>
      <View>
        <View style={styles.content}>
          <Text>제목 : {title}</Text>
          {/* <Text>제목 : {id}</Text> */}
          <Text>내용 : {content}</Text>
          <Text>멤버 : {memberList ? memberList.join(', ') : '없음'}</Text>
          <Text>{startDay}  ~  {endDay}</Text>
        </View>
        {/* <View>
          <ChatCreateBtn title={title} calendarUID={itemKey} friends={members} />
        </View> */}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgreen',
    padding: 10,
    backgroundColor: '#fff'
  },
  horizontalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
})

export default PickItem