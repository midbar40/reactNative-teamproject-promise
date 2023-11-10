import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { getChatRoomList } from '../apis/firebaseChat';

// 컴포넌트
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ChatScreen({ navigation, selectRoomId, setSelectRoomId }){
  const [roomTitle, setRoomTitle] = useState('');
  const [chatRoomList, setChatRoomList] = useState([]);
  
  useEffect(() => {
    getChatRoomList()
    .then(r => setChatRoomList(r))
  }, [])
  
  return (
    <Stack.Navigator screenOptions={{ headerShown : false }}>
      <Stack.Screen name="ChatRoomList" children={(props) => 
        <ChatRoomList
          {...props}
          setRoomTitle={setRoomTitle}
          roomTitle={roomTitle}
          chatRoomList={chatRoomList}
          setChatRoomList={setChatRoomList}
          setSelectRoomId={setSelectRoomId}
        />
      }/>
      <Stack.Screen name="ChatRoom" children={(props) => 
        <ChatRoom 
          {...props}
          roomTitle={roomTitle}
          selectRoomId={selectRoomId}
        />
      }/>
    </Stack.Navigator>
  )
}

export default ChatScreen;