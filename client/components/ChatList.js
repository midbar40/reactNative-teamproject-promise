import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getUser } from '../apis/auth';

function ChatList({ message, userUID, userEmail, date, uploadFilePath, toggleImgModal, setToggleImgModal }){
  const myUserUID = getUser().uid;
  const chatDate = new Date(date);

  const clickImageHandle = () => {
    setToggleImgModal(uploadFilePath);
  }

  return (
    <>
    {myUserUID === userUID ?
      <View style={styles.myMessageContainer}>
        <View style={styles.myMessageTimeContainer}>
          <Text style={{fontSize : 12}}>{chatDate.getHours() < 12 ? `오전 ${chatDate.getHours()} : ${chatDate.getMinutes()}` : 
          (chatDate.getHours() !== 12 ? `오후 ${chatDate.getHours() - 12} : ${chatDate.getMinutes()}` :
          `오후 ${chatDate.getHours()} : ${chatDate.getMinutes()}`)}</Text>
        </View>
        <TouchableOpacity style={styles.myMessageBox} onPress={clickImageHandle}>
          {uploadFilePath === '' ?
            <Text style={styles.chatText}>{message}</Text> :
            <Image src={`${uploadFilePath}`} style={{width : 100, height : 100, marginVertical : 2}}/>
          }
        </TouchableOpacity>
      </View>
      :
      <View style={styles.otherMessageContainer}>
        <View style={styles.otherMessageUserName}>
          <Text>{userEmail}</Text>
        </View>
        <View style={{ flexDirection : 'row'}}>
          <TouchableOpacity style={styles.otherMessageBox} onPress={clickImageHandle}>
            {uploadFilePath === '' ?
              <Text style={styles.chatText}>{message}</Text> :
              <Image src={`${uploadFilePath}`} style={{width : 100, height : 100, marginVertical : 2}}/>
            }
          </TouchableOpacity>
          <View style={styles.otherMessageTimeContainer}>
            <Text style={{fontSize : 12}}>{chatDate.getHours() < 12 ? `오전 ${chatDate.getHours()} : ${chatDate.getMinutes()}` : 
            (chatDate.getHours() !== 12 ? `오후 ${chatDate.getHours() - 12} : ${chatDate.getMinutes()}` :
            `오후 ${chatDate.getHours()} : ${chatDate.getMinutes()}`)}</Text>
          </View>
        </View>
      </View>
    }
    
    </>
  )
}

const styles = StyleSheet.create({
  myMessageContainer : {
    justifyContent : 'flex-end',
    marginBottom : 12,
    paddingRight : 10,
    flexDirection: 'row'
  },
  myMessageTimeContainer : {
    marginRight : 3,
    alignSelf : 'flex-end'
  },
  myMessageBox : {
    paddingHorizontal : 8,
    // paddingVertical : 2,
    paddingBottom : 2,
    borderRadius : 5,
    backgroundColor : '#69DBB1',
    maxWidth : '70%',
    
  },
  otherMessageContainer : {
    alignItems : 'flex-start',
    marginBottom : 12,
    paddingLeft : 10
  },
  otherMessageUserName : {
    marginBottom : 1,
  },
  otherMessageBox : {
    paddingHorizontal : 8,
    paddingVertical : 2,
    borderRadius : 5,
    backgroundColor : '#C7A1DB',
    maxWidth : '70%',
  },
  otherMessageTimeContainer : {
    marginLeft : 3,
    alignSelf : 'flex-end'
  },
  chatText : {
    lineHeight : 22,
  },
})

export default ChatList;