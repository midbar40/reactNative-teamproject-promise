import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 컴포넌트
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ChatScreen({ navigation }){
  const [roomName, setRoomName] = useState('');

  return (
    <Stack.Navigator screenOptions={{ headerShown : false }}>
      <Stack.Screen name="ChatRoomList" children={(props) => 
        <ChatRoomList
          {...props}
          setRoomName={setRoomName}
          roomName={roomName}
        />
      }/>
      <Stack.Screen name="ChatRoom" children={(props) => 
        <ChatRoom 
          {...props}
          roomName={roomName}
        />
      }/>
    </Stack.Navigator>
  )
}

export default ChatScreen;