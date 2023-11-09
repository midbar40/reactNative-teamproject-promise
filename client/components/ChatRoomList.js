import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

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
      <TextInput 
        onChangeText={setRoomTitle}
        style={{ backgroundColor : '#ffb'}}
        placeholder='임시 방 이름을 입력하세요!'
      />
      <Button onPress={creatRoom} title='만들기'></Button>
      <View style={styles.chatRoomListHeader}>
        <Text style={styles.chatRoomListHeaderText}>채팅방 목록</Text>
      </View>
      <FlatList 
        data={chatRoomList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => enterRoom(item?._ref._documentPath._parts[1])}
          >
            <View style={styles.chatRoomListContainer}><Text style={styles.chatRoomListText}>{item?._data.roomTitle}</Text></View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item?._ref._documentPath._parts[1]}
      />
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  chatRoomListHeader : {
    width : '100%',
    height : 40,
    marginBottom : 10,
    backgroundColor : '#AAA',
  },
  chatRoomListHeaderText : {
    color : '#fff',
    paddingLeft : 20,
    fontSize : 25,
    lineHeight : 40,
    fontWeight : 'bold',
  },
  chatRoomListContainer : {
    width : '100%',
    height : 50,
    borderColor : '#000',
    backgroundColor : '#00B7FA',
  },
  chatRoomListText : {
    fontSize : 20,
    lineHeight : 50,
    paddingLeft : 10,
    color : '#fff',
    fontWeight : 'bold',
  },
})

export default ChatRoomList;