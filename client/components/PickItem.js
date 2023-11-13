import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

import { updateData } from '../apis/firebaseCalendar'



function PickItem({ title, content, startDay, endDay, id, members, itemKey, setItemKey, setOpenModal}){

  const longPress = () => {
    console.log('길게누르기', id)
    setItemKey(id)
    setOpenModal(true)

  }

  return(
    <Pressable onLongPress={longPress}>
      <View>
        <View style={styles.content}>
          <Text>제목 : {title}</Text>
          {/* <Text>제목 : {id}</Text> */}
          <Text>내용 : {content}</Text>
          <Text>멤버 : {members ? members.map(member => `${member.name}, `) : '없음'}</Text>
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