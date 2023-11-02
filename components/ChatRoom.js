import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

// 컴포넌트
import ChatList from './ChatList';

import { sendMessageToFirebase, getMessage } from '../apis/firebaseChat';

function ChatRoom({ navigation, roomName }){
  const [message, setMessage] = useState('');
  const [messageList , setMessageList] = useState();

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

    getMessage(roomName, onResult, onRrror)
    
  }, []);

  console.log(messageList)

  return (
    <SafeAreaView>
      <View>
        <Text>{roomName.trim()} 채팅방</Text>
      </View>
      <View>
        {messageList.length !== 0 &&
          messageList.map(chat => <ChatList message={chat.message}/>)
        }
      </View>
      <View>
        <TextInput 
          onChangeText={setMessage}
          value={message}
        />
        <TouchableOpacity onPress={sendMessage}>
          <View>
            <Text>전송</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ChatRoom;