import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

// 컴포넌트
import ChatList from './ChatList';

import { sendMessageToFirebase, getMessage } from '../apis/firebaseChat';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';

function ChatRoom({ navigation, roomTitle, selectRoomId }){
  const [message, setMessage] = useState('');
  const [messageList , setMessageList] = useState([]);
  const [uploadFile, setUploadFile] = useState({})

  const flatList = useRef()

  const sendMessage = async () => {
    try {
      await sendMessageToFirebase(selectRoomId, message);
      setMessage('');
    } catch (error) {
      console.log(error)
    }
    
  }


  const openImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        // console.log('response', response);
        // console.log('uri : ',  response.assets[0].uri)
        setUploadFile({
          filePath: response,
          fileData: response.data,
          fileUri: response.assets[0].uri
        });
      }
    });

  }

  console.log(uploadFile)

  useEffect(() => {
    function onResult(querySnapshot){
      // querySnapshot.forEach(doc => {
      //   list.push({
      //     ...doc.data(),
      //     id : doc.id
      //   })
      // });
      setMessageList(querySnapshot.data())
    }

    function onError(error){
      console.log(error)
    }

    return getMessage(selectRoomId, onResult, onError)
    
  }, []);

  // console.log(messageList)

  return (
    <SafeAreaView style={styles.block}>
      <View style={styles.chatRoomNameContainer}>
        <Text style={styles.chatRoomNameText}>{messageList?.roomTitle} 채팅방</Text>
      </View>
      <FlatList
        data={messageList?.messages}
        renderItem={({ item }) => {return <ChatList message={item.message} userUID={item.userUID} userEmail={item.userEmail}/>}}
        keyExtractor={item => item.date}
        ref={flatList}
        onContentSizeChange={()=> flatList.current.scrollToEnd()}
      />
        {/* {messageList?.length !== 0 &&
          messageList?.map(chat => <ChatList key={chat.date} message={chat.message} user={chat.user}/>)
        } */}
      
      <View style={styles.chatInputContainer}>
        <TouchableOpacity onPress={openImageLibrary} style={styles.addFileButtonContainer} on>
          <View style={{ flex : 1 }}>
            <Text style={styles.addFileButtonText}>+</Text>
          </View>
        </TouchableOpacity>
        <TextInput 
          onChangeText={setMessage}
          value={message}
          style={styles.chatTextInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.chatSubmitButton}>
          <View>
            <Text style={styles.chatSubmitButtonText}>보내기</Text>
          </View>
        </TouchableOpacity>
      </View>
      {
        uploadFile.fileUri &&
        <View style={styles.addImageViewContaier}>
          <Image source={{ uri : uploadFile.fileUri }} style={styles.addImage}/>
        </View>
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  block : {
    flex : 1,
  },
  chatRoomNameContainer : {
    paddingLeft : 20,
    backgroundColor : '#43B2DB',
    height : 40,
    marginBottom : 5,
  },
  chatRoomNameText : {
    fontSize : 20,
    lineHeight : 40,
    fontWeight : 'bold',
    color : '#fff',
  },
  chatInputContainer : {
    // position : 'absolute',
    // bottom : 0,
    // alignItems : 'flex-end',
    flexDirection : 'row'
  },
  chatTextInput : {
    backgroundColor : '#fff',
    paddingVertical : 0,
    flex : 1,
  },
  chatSubmitButton : {
    width : 70,
    backgroundColor : "#A0DBCB"
  },
  chatSubmitButtonText : {
    color : '#fff',
    textAlign : 'center',
    fontWeight : 'bold',
    fontSize : 18,
  },
  addFileButtonContainer : {
    width : 30,
    backgroundColor :"#A0DBCB",
  },
  addFileButtonText : {
    fontSize : 20,
    textAlign : 'center',
    fontWeight : 'bold',
  },
  addImageViewContaier : {
    height : 200,
    backgroundColor : '#eee',
  },
  addImage : {
    width : '50%',
    height : '100%',
    alignSelf : 'center'
  }
})

export default ChatRoom;