import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

import { creatChatRoom, getChatRoomList } from '../apis/firebaseChat';

function ChatRoomList({ navigation, chatRoomList, setSelectRoomId }){
  const enterRoom = (roomId) => {
    console.log('enter room id : ',roomId);
    setSelectRoomId(roomId);
    navigation.navigate('ChatRoom');
  }
  
  // 채팅방 조회
  // console.log('rooms : ',chatRoomList); 

  return(
    <SafeAreaView>
      <View style={styles.chatRoomListHeader}>
        <Text style={styles.chatRoomListHeaderText}>캘린더 톡</Text>
      </View>
      <FlatList 
        data={chatRoomList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => enterRoom(item?.chatRoomUID)}
          >
            <View style={styles.chatRoomListContainer}><Text style={styles.chatRoomListText}>{item?.title}</Text></View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item?.chatRoomUID}
      />
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  chatRoomListHeader : {
    width : '100%',
    height : 40,
    marginBottom : 10,
    borderBottomWidth : 1,
    borderBottomColor : '#333'
  },
  chatRoomListHeaderText : {
    color : '#333',
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