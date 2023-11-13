import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { creatChatRoom } from '../apis/firebaseChat';

function ChatCreateBtn({ title, calendarUID, friends, navigation, setSelectRoomId }){
  // console.log(friends)
  const moveToCalendarTalk = async () => {
    const chatRoomUID = await creatChatRoom(title, calendarUID, friends);
    setSelectRoomId(chatRoomUID);
    navigation.navigate('ChatRoom');
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
    textAlign : 'center',
    lineHeight : 30,
  },
})

export default ChatCreateBtn;