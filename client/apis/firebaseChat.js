import firestore from '@react-native-firebase/firestore';
import { getUser } from './auth';

export const sendMessageToFirebase = async (roomName, message) => {
  try {
    const getChatRoom = await firestore().collection(`chat`).doc(`${roomName}`).get();
    if(getChatRoom.exists){
      console.log(getChatRoom);
      console.log(getChatRoom.data());
      const messages = getChatRoom.data().message;
      const newMessage = {
        message : message,
        date : Date.now(),
        userUID : getUser().uid,
        userEmail : getUser().email,
      }
      await firestore().collection(`chat`).doc(`${roomName}`).update({
        message : [...messages, newMessage]
      })
    } else {
      await firestore().collection(`chat`).doc(`${roomName}`).set({
        roomTitle : roomName,
        message : [
          {
            message : message,
            date : Date.now(),
            userUID : getUser().uid,
            userEmail : getUser().email,
          }
        ]
      })
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

export const getMessage = (roomName, onResult, onError) => {
  return firestore()
    .collection(`chat`)
    .doc(`${roomName}`)
    // .orderBy('date', 'asc')
    .onSnapshot(onResult, onError);
}