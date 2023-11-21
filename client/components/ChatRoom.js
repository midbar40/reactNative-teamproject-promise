import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Modal, StatusBar } from 'react-native';

// 컴포넌트
import ChatList from './ChatList';

import { sendMessageToFirebase, getMessage, uploadFileToFirebaseStorage, getChatFile } from '../apis/firebaseChat';
import { launchImageLibrary } from 'react-native-image-picker';
import {  sendNotification } from '../apis/firebaseMessage';

function ChatRoom({ navigation, selectRoomId }){
  const [message, setMessage] = useState(''); // 인풋에 적은 메세지
  const [messageList , setMessageList] = useState([]); // DB로 부터 실시간으로 받은 메세지 리스트
  const [uploadFile, setUploadFile] = useState({}); // 갤러리에서 선택한 (이미지) 파일
  const [toggleImgModal, setToggleImgModal] = useState(''); // 이미지를 확대해서 보여주는 모달 토글
  const [showingChatList, setShowingChatList] = useState([]); // 실제로 보여질 메세지 리스트
  const [page, setPage] = useState(1); // 보여지는 채팅 페이지 넘버링을 위한 스테이트
  const numOfNewMessages = useRef(-1); // 채팅창을 연 이후 새로 DB에 등록 된 메세지 수
  const [isMessageListEnd, setIsMessageListEnd] = useState(false); // 보여진 메세지가 끝인지 판별

  // const flatList = useRef();

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

  // 보여질 메세지 가공
  const showingChatListHandler = (messageList ,page, numOfNewMessages) => {
    // console.log('page : ' ,page)
    // console.log('munofmsg : ', numOfNewMessages)
    const modifyChatList = messageList?.messages.filter((m,index) => {
      if(!isMessageListEnd && (page * 25) + numOfNewMessages > messageList?.messages.length - 1){
        // console.log('msg end',(page * 25) + numOfNewMessages,messageList?.messages.length - 1)
        setIsMessageListEnd(true);
      }
      if(index < (page * 25) + numOfNewMessages){
        return true;
      } else {
        return false;
      }
    })
    // console.log('modi : ',modifyChatList)
    setShowingChatList(modifyChatList)
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
      setMessageList(querySnapshot.data());
      numOfNewMessages.current += 1;
      showingChatListHandler(querySnapshot.data(), page, numOfNewMessages.current);
    }

    function onError(error){
      console.log(error)
    }
    
    return getMessage(selectRoomId, onResult, onError)
    
  }, [page]);

  useEffect(() => {
    if(messageList?.messages?.length !== 0 && page > 1){
      showingChatListHandler(messageList, page, numOfNewMessages.current);
    }
  },[page])

  

  // console.log(uploadFile.fileUri)

  return (
    <SafeAreaView style={styles.block}>
      <StatusBar hidden></StatusBar>
      <View style={styles.chatRoomNameContainer}>
        <TouchableOpacity style={styles.returnBtnContainer} onPress={() => navigation.navigate('ChatRoomList')}>
          <Text style={styles.returnBtnText}>◀</Text>
        </TouchableOpacity>
        <Text style={[styles.chatRoomNameText, styles.font]}>{messageList?.title} 채팅방</Text>
      </View>
      <FlatList
        data={showingChatList}
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
        // ref={flatList}
        // onContentSizeChange={() => flatList.current.scrollToEnd()}
        // onLayout={() => flatList.current.scrollToEnd()}
        inverted
        onEndReached={() => {!isMessageListEnd && setPage(page + 1)}}
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
            <Text style={[styles.chatSubmitButtonText, styles.font]}>보내기</Text>
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
        statusBarTranslucent={true}
      >
        <SafeAreaView style={{ flex : 1 }}>
          <View style={{ paddingTop : 30}}>
            <TouchableOpacity onPress={() => {setToggleImgModal('')}} style={styles.foucusImageCancelBtnContainer}>
              <Text style={[styles.foucusImageCancelBtnText, styles.font]}>취소</Text>
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
    backgroundColor: '#fff',
  },
  chatRoomNameContainer : {
    backgroundColor : '#FAA6AA',
    height : 40,
    marginBottom : 5,
    flexDirection : 'row'
  },
  returnBtnContainer : {
    width : 40,
    height : 40,
    marginRight : 10,
    backgroundColor : '#F7CAC9',
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
    // fontWeight : 'bold',
    color : '#fff',
  },
  chatInputContainer : {
    // position : 'absolute',
    // bottom : 0,
    // alignItems : 'flex-end',
    flexDirection : 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    // justifyContent:'center',
    // alignItems:'center',
    // height: 35,
  },
  chatTextInput : {
    backgroundColor : '#fff',
    paddingVertical : 0,
    flex : 1,
    padding: 5,
  },
  chatSubmitButton : {
    width : 70,
    backgroundColor : "#69DBB1",
  },
  chatSubmitButtonText : {
    color : '#fff',
    textAlign : 'center',
    // fontWeight : 'bold',
    fontSize : 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addFileButtonContainer : {
    width : 30,
    backgroundColor :"#69DBB1",
  },
  addFileButtonText : {
    fontSize : 20,
    textAlign : 'center',
    // fontWeight : 'bold',
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
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold',
  }
})

export default ChatRoom;