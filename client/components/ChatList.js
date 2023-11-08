import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getUser } from '../apis/auth';

function ChatList({ message, userUID, userEmail, uploadFilePath }){
  const myUserUID = getUser().uid;
  // console.log(uploadFilePath)
  return (
    <>
    {myUserUID === userUID ?
      <View style={styles.myMessageContainer}>
        <View style={styles.myMessageBox}>
          {uploadFilePath === '' ?
            <Text style={styles.chatText}>{message}</Text> :
            <Image src={`${uploadFilePath}`} style={{width : 100, height : 100}}/>
          }
        </View>
      </View>
      :
      <View style={styles.otherMessageContainer}>
        <View style={styles.otherMessageUserName}>
          <Text>{userEmail}</Text>
        </View>
        <View style={styles.otherMessageBox}>
          <Text>{message}</Text>
        </View>
      </View>
    }
    </>
  )
}

const styles = StyleSheet.create({
  myMessageContainer : {
    alignItems : 'flex-end',
    marginBottom : 12,
    paddingRight : 10
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
  chatText : {
    lineHeight : 22,
  },
})

export default ChatList;