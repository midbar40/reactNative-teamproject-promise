import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

// 컴포넌트
import ChatList from './ChatList';

import { sendMessageToFirebase, getMessage } from '../apis/firebaseChat';

function ChatRoom({ navigation, roomName }){
  const [message, setMessage] = useState('');
  const [messageList , setMessageList] = useState([]);

  const sendMessage = async () => {
    try {
      await sendMessageToFirebase(roomName, message);
      setMessage('');
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
    function onResult(querySnapshot){
      const list = [];
      querySnapshot.forEach(doc => {
        list.push({
          ...doc.data(),
          id : doc.id
        })
      });
      setMessageList([...list])
    }

    function onRrror(error){
      console.log(error)
    }

    return getMessage(roomName, onResult, onRrror)
    
  }, []);

  console.log(messageList)

  return (
    <SafeAreaView style={styles.block}>
      <View style={styles.chatRoomNameContainer}>
        <Text style={styles.chatRoomNameText}>{roomName.trim()} 채팅방</Text>
      </View>
      <FlatList
        data={messageList}
        renderItem={({ item }) => {return <ChatList message={item.message} userUID={item.userUID} userEmail={item.userEmail}/>}}
        keyExtractor={item => item.date}
      />
        {/* {messageList?.length !== 0 &&
          messageList?.map(chat => <ChatList key={chat.date} message={chat.message} user={chat.user}/>)
        } */}
      <View style={styles.chatInputContainer}>
        <TextInput 
          onChangeText={setMessage}
          value={message}
          style={styles.chatTextInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.chatSubmitButton}>
          <View>
            <Text style={styles.chatSubmitButtonText}>보내기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  block : {
    flex : 1,
  },
  chatRoomNameContainer : {
    paddingLeft : 20,
    backgroundColor : '#43B2DB',
    height : 40,
    marginBottom : 5,
  },
  chatRoomNameText : {
    fontSize : 20,
    lineHeight : 40,
    fontWeight : 'bold',
    color : '#fff',
  },
  chatInputContainer : {
    // position : 'absolute',
    // bottom : 0,
    // alignItems : 'flex-end',
    flexDirection : 'row'
  },
  chatTextInput : {
    backgroundColor : '#fff',
    paddingVertical : 0,
    flex : 1,
  },
  chatSubmitButton : {
    width : 70,
    backgroundColor : "#A0DBCB"
  },
  chatSubmitButtonText : {
    color : '#fff',
    textAlign : 'center',
    fontWeight : 'bold',
    fontSize : 18,
  }
})

export default ChatRoom;