import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { creatChatRoom } from '../apis/firebaseChat';

function ChatCreateBtn({ title, calendarUID, friends}){
  // console.log(friends)
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
    backgroundColor : 'lightgreen',
    right: 0,
    width: 70,
    height: '100%',
    padding: 5,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarTalkText : {
    color : '#fff',
    fontWeight : 'bold',
    fontSize : 15,
  },
})

export default ChatCreateBtn;