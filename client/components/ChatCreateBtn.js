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
    width : 50,
    height : 30,
    backgroundColor : 'lightgreen'
  },
  calendarTalkText : {
    color : '#fff',
    fontWeight : 'bold',
    fontSize : 15,
  },
})

export default ChatCreateBtn;