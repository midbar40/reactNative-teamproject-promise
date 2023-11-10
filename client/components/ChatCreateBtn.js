import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { creatChatRoom } from '../apis/firebaseChat';

function ChatCreateBtn({ title, calendarUID, friends }){
  const moveToCalendarTalk = () => {
    creatChatRoom(title, calendarUID, friends)
  }

  return (
    <TouchableOpacity style={styles.calendarTalkContainer} onPress={moveToCalendarTalk}>
      <Text style={styles.calendarTalkText}>캘린더톡</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  calendarTalkContainer : {
    width : 80,
    height : 30,
    backgroundColor : 'lightgreen',
    borderRadius : 5,
  },
  calendarTalkText : {
    color : '#fff',
    fontWeight : 'bold',
    fontSize : 15,
    textAlign : 'center',
    lineHeight : 30,
  },
})

export default ChatCreateBtn;