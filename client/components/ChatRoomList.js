import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

import { creatChatRoom, getChatRoomList } from '../apis/firebaseChat';

function ChatRoomList({ navigation, setRoomTitle, roomTitle, chatRoomList, setChatRoomList, setSelectRoomId }){
  const creatRoom = () => {
    if(roomTitle.trim() !== ''){
      creatChatRoom(roomTitle.trim());
      getChatRoomList()
      .then(r => setChatRoomList(r))
    }
  }

  const enterRoom = (roomId) => {
    console.log('enter room id : ',roomId);
    setSelectRoomId(roomId);
    navigation.navigate('ChatRoom');
  }
  
  // 채팅방 id 조회
  // console.log('rooms : ',chatRoomList[0]?._ref._documentPath._parts[1]); 
  return(
    <SafeAreaView>
      <View><Text>chatroomlist</Text></View>
      <TextInput 
        onChangeText={setRoomTitle}
      />
      <Button onPress={creatRoom} title='만들기'></Button>
      <FlatList 
        data={chatRoomList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => enterRoom(item?._ref._documentPath._parts[1])}
          >
            <View><Text>{item?._data.roomTitle}</Text></View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item?._ref._documentPath._parts[1]}
      />
    </SafeAreaView>
    
  )
}

export default ChatRoomList;