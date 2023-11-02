import firestore from '@react-native-firebase/firestore';

export const sendMessageToFirebase = async (roomName, message) => {
  try {
    await firestore().collection(`${roomName}`)
    .add({
      message : message,
      date : Date.now()
    })
  } catch (error) {
    console.log(error)
  }
  
}

export const getMessage = (roomName, onResult, onError) => {
  return firestore()
    .collection(`${roomName}`)
    // .orderBy('date', 'desc')
    .onSnapshot(onResult, onError);
}