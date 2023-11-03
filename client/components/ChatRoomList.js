import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Button } from 'react-native';

function ChatRoomList({ navigation, setRoomName, roomName }){
  const enterRoom = () => {
    if(roomName.trim() !== ''){
      navigation.navigate('ChatRoom');
    }
    
  }
  return(
    <SafeAreaView>
      <View><Text>chatroomlist</Text></View>
      <TextInput 
        onChangeText={setRoomName}
      />
      <Button onPress={enterRoom} title='입장'></Button>
    </SafeAreaView>
    
  )
}

export default ChatRoomList;