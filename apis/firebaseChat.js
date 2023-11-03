import firestore from '@react-native-firebase/firestore';
import { getUser } from './auth';

export const sendMessageToFirebase = async (roomName, message) => {
  try {
    await firestore().collection(`${roomName}`)
    .add({
      message : message,
      date : Date.now(),
      userUID : getUser().uid,
      userEmail : getUser().email,
    })
  } catch (error) {
    console.log(error)
  }
  
}

export const getMessage = (roomName, onResult, onError) => {
  return firestore()
    .collection(`${roomName}`)
    .orderBy('date', 'asc')
    .onSnapshot(onResult, onError);
}