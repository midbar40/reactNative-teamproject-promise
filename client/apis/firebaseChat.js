import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { getUser } from './auth';

export const creatChatRoom = async (title, calendarUID, friends) => { // 현재는 룸 타이틀로 해서 같은 제목이 있는경우는 안만들게 했지만 추 후 캘린더 아이디값을 받을 예정
  try {
    const getChatRoom = await firestore().collection('chat').where('calendarUID','==',calendarUID).get();
    console.log(getChatRoom);
    if(getChatRoom.docs.length !== 0){
      console.log('room is exists');
      return false;
    } else {
      console.log('room is not exist');
      await firestore().collection(`chat`).add({
        title : title,
        invitedUser : [],
        joinUser : [friends],
        messages : [],
        calendarUID : calendarUID,
      })
      .then(r => console.log('r:',r.id))
    }
  } catch (error) {
    console.log(error);
  }
}

export const sendMessageToFirebase = async (selectRoomId, message, uploadFilePath = '') => {
  try {
    const getChatRoom = await firestore().collection(`chat`).doc(`${selectRoomId}`).get();
    console.log(getChatRoom.exists)
    if(getChatRoom.exists){
      // console.log(getChatRoom);
      // console.log(getChatRoom.data());
      const messages = getChatRoom.data().messages;
      const newMessage = {
        message : message,
        date : Date.now() + 32400000,
        userUID : getUser().uid,
        userEmail : getUser().email,
        uploadFilePath : uploadFilePath,
      }
      await firestore().collection(`chat`).doc(`${selectRoomId}`).update({
        messages : [...messages, newMessage]
      })
    } else {
      // await firestore().collection(`chat`).doc(`${roomName}`).set({
      //   roomTitle : roomName,
      //   inviteUser : [],
      //   joinUser : [getUser().uid],
      //   message : [
      //     {
      //       message : message,
      //       date : Date.now(),
      //       userUID : getUser().uid,
      //       userEmail : getUser().email,
      //     }
      //   ]
      // })
      // .then(r => console.log('r:',r))
      
    }
    // .add({
    //   message : message,
    //   date : Date.now(),
    //   userUID : getUser().uid,
    //   userEmail : getUser().email,
    // })
  } catch (error) {
    console.log(error)
  }
  
}

export const getMessage = (roomid, onResult, onError) => {
  return firestore()
    .collection(`chat`)
    .doc(`${roomid}`)
    // .orderBy('date', 'asc')
    .onSnapshot(onResult, onError);
}

// 로그인 한 유저가 참가한 채팅방 얻기
export const getChatRoomList = async () => {
  const chatRoomList = await firestore().collection('chat').where('joinUser','array-contains',`${getUser().uid}`).get();
  // console.log(chatRoomList.docs)
  return chatRoomList.docs;
}

export const uploadFileToFirebaseStorage = async (fileAsset, roomId) => {
  // console.log('f asset : ',fileAsset)
  const splitPath = fileAsset.uri.split('/');
  const refName = splitPath[splitPath.length - 1];
  const reference = storage().ref(`/uploadFileByChat/${roomId}/${refName}`);
  // console.log(fileAsset.base64)
  await reference.putString(fileAsset.base64, "base64", {
    contentType : fileAsset.type
  })
  sendMessageToFirebase(roomId, '', refName);
}

export const getChatFile = async (roomId, filePath) => {
  try {
    // console.log(filePath)
    const reference = storage().ref(`/uploadFileByChat/${roomId}/${filePath}`);
    const url = await reference.getDownloadURL();
    console.log('ref : ',url);
    return Promise.resolve(url);
  } catch (error) {
    console.log(error)
  }
}