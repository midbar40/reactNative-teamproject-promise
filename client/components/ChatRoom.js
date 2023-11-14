import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Modal } from 'react-native';

// 컴포넌트
import ChatList from './ChatList';

import { sendMessageToFirebase, getMessage } from '../apis/firebaseChat';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadFileToFirebaseStorage, getChatFile, sendNotification } from '../apis/firebaseChat';

function ChatRoom({ navigation, selectRoomId }){
  const [message, setMessage] = useState('');
  const [messageList , setMessageList] = useState([]);
  const [uploadFile, setUploadFile] = useState({});
  const [toggleImgModal, setToggleImgModal] = useState('');
  const [showingChatList, setShowingChatList] = useState('');
  const [chatIndex, setChatIndex] = useState(1);

  const flatList = useRef();

  const sendMessage = async () => {
    if(message.trim() !== ''){
      try {
        await sendMessageToFirebase(selectRoomId, message);
        sendNotification(message ,selectRoomId)
        setMessage('');
      } catch (error) {
        console.log(error)
      }
    } else {
      uploadFileToFirebaseStorage(uploadFile.fileData, selectRoomId);
      sendNotification(message ,selectRoomId)
      setUploadFile({});
    }
    
  }

  // 이미지 갤러리 오픈
  const openImageLibrary = () => {
    setMessage('');
    let options = {
      mediaType: "photo",
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

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
          fileData: response.assets[0],
          fileUri: response.assets[0].uri
        });
      }
    });

  }

  // 채팅방 메세지 받아오기
  useEffect(() => {
    async function onResult(querySnapshot){
      // querySnapshot.forEach(doc => {
      //   list.push({
      //     ...doc.data(),
      //     id : doc.id
      //   })
      // });
      // console.log(querySnapshot.data().messages)
      await Promise.all(querySnapshot.data().messages.map(async (doc) => {
        if(doc.message !== ''){
          return doc;
        } else {
            const url = await getChatFile(selectRoomId, doc.uploadFilePath);
            // console.log('url : ',url)
            doc.uploadFilePath = url;
            return doc;
        }
      })) 
      // console.log(querySnapshot.data().messages)
      setMessageList(querySnapshot.data())
      
    }

    function onError(error){
      console.log(error)
    }

    return getMessage(selectRoomId, onResult, onError)
    
  }, []);

  // console.log(uploadFile.fileUri)

  return (
    <SafeAreaView style={styles.block}>
      <View style={styles.chatRoomNameContainer}>
        <TouchableOpacity style={styles.returnBtnContainer} onPress={() => navigation.navigate('ChatRoomList')}>
          <Text style={styles.returnBtnText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.chatRoomNameText}>{messageList?.title} 채팅방</Text>
      </View>
      <FlatList
        data={messageList.messages}
        renderItem={({ item }) => (
          <ChatList 
            message={item.message} 
            userUID={item.userUID} 
            userName={item.name} 
            date={item.date} 
            uploadFilePath={item.uploadFilePath} 
            setToggleImgModal={setToggleImgModal}
          />)}
        keyExtractor={item => item.date}
        ref={flatList}
        // onContentSizeChange={() => flatList.current.scrollToEnd()}
        // onLayout={() => flatList.current.scrollToEnd()}
        inverted
      />
        {/* {messageList?.length !== 0 &&
          messageList?.map(chat => <ChatList key={chat.date} message={chat.message} user={chat.user}/>)
        } */}
      
      <View style={styles.chatInputContainer}>
        {uploadFile?.fileUri ? 
          <TouchableOpacity onPress={() => setUploadFile({})} style={styles.addFileButtonContainer} on>
            <View style={{ flex : 1 }}>
              <Text style={styles.addFileButtonText}>x</Text>
            </View>
          </TouchableOpacity>
        :
          <TouchableOpacity onPress={openImageLibrary} style={styles.addFileButtonContainer} on>
            <View style={{ flex : 1 }}>
              <Text style={styles.addFileButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        }
        
        <TextInput 
          onChangeText={setMessage}
          value={message}
          style={styles.chatTextInput}
          editable={uploadFile?.fileUri ? false : true}
        />
        <TouchableOpacity onPress={sendMessage} style={[styles.chatSubmitButton, !uploadFile?.fileUri && !message.trim() && {backgroundColor : 'lightgray'} ]}>
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
      <Modal
        visible={toggleImgModal === ''? false : true}
        transparent={false}
      >
        <SafeAreaView style={{ flex : 1 }}>
          <View style={{ paddingTop : 10}}>
            <TouchableOpacity onPress={() => {setToggleImgModal('')}} style={styles.foucusImageCancelBtnContainer}>
              <Text style={styles.foucusImageCancelBtnText}>취소</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.focusImageContainer}>
            {toggleImgModal !== '' && <Image src={`${toggleImgModal}`} style={styles.focusImage}/>}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  block : {
    flex : 1,
  },
  chatRoomNameContainer : {
    backgroundColor : '#43B2DB',
    height : 40,
    marginBottom : 5,
    flexDirection : 'row'
  },
  returnBtnContainer : {
    width : 40,
    height : 40,
    marginRight : 10,
    backgroundColor : '#B0CEFA',
  },
  returnBtnText : {
    color : '#fff',
    fontSize : 20,
    fontWeight : 'bold',
    lineHeight : 40,
    textAlign : 'center',
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
    alignSelf : 'center',
  },
  focusImageContainer : {
    flex : 1,
    justifyContent : 'center'
  },
  focusImage : {
    width : '100%',
    height : '50%',
  },
  foucusImageCancelBtnContainer : {
    width : 50,
    height : 30,
  },
  foucusImageCancelBtnText : {
    fontSize : 18,
    paddingLeft : 10
  }
})

export default ChatRoom;