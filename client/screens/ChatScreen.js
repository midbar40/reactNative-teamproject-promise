import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

import { getChatRoomList } from '../apis/firebaseChat';

// 컴포넌트
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ChatScreen({ navigation, selectRoomId, setSelectRoomId }){
  const [roomTitle, setRoomTitle] = useState('');
  const [chatRoomList, setChatRoomList] = useState([]);
  
  // 로그인 한 유저가 참가되있는 캘린더톡 리스트
  useEffect(() => {
    const onResult = (querySnapshot) => {
      const list = querySnapshot.docs.map(d => {
        return {
          chatRoomUID : d._ref._documentPath._parts[1],
          title : d._data.title,
          joinUser : d._data.joinUser
        }
      })
      // console.log('data : ',chatRoomList)
      setChatRoomList(list);
    }

    const onError = (error) => {
      console.log(error)
    }

    return getChatRoomList(onResult, onError)
  }, [])

  useEffect(() => {
    if(selectRoomId !== ''){
      navigation.navigate('ChatRoom');
    }
  },[selectRoomId])

  const tabHidden = () => {
    navigation.setOptions({ tabBarStyle : {display: 'none' }})
  }

  const tabShow = () => {
    navigation.setOptions({ tabBarStyle : {display: 'flex' }})
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown : false }} colors={{background: '#fff'}}>
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
          tabShow={tabShow}
          tabHidden={tabHidden}
          roomTitle={roomTitle}
          selectRoomId={selectRoomId}
        />
      }/>
    </Stack.Navigator>
  )
}

export default ChatScreen;