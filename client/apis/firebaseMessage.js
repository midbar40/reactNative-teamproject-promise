import { MESSAGE_SERVICE_KEY } from '@env';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import { getUser } from '../apis/auth';
import firestore from '@react-native-firebase/firestore';

export const getToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  // console.log('token : ', token)
  firestore().collection('user').doc(getUser()?.uid).update({
    FCMToken : token
  })
}

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // navigation.navigate(remoteMessage.data.type);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
}


export async function requestUserPermission() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export const sendNotification = async (message, roomUID) => {
  const FCMTokens = await getMemberFCMTokens(roomUID);
  const myUID = getUser().uid;
  const myData = await firestore().collection('user').doc(myUID).get();
  const myName = myData.data().name;
  console.log(myName)
  FCMTokens.forEach(t => {
    try {
      fetch('https://fcm.googleapis.com/fcm/send', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${MESSAGE_SERVICE_KEY}`
      },
      body : JSON.stringify({
        "to": `${t}`,
        "notification": {
          "title": `${myName}`,
          "body": `${message.trim() !== ''? message : '사진'}`,
          "mutable_content": true,
          // "sound": "Tri-tone"
          }
      })
    })
    .catch(e => console.log(e))
    .then(r => console.log(r))
    } catch (error) {
      console.log('noti error : ',error)
    }
  })
}

// 채팅방에 있는 유저들의 FCM토큰 반환
export const getMemberFCMTokens = async (roomUID) => {
  const myUID = getUser().uid;
  try {
    const getChatRoomData = await firestore().collection('chat').doc(roomUID).get();
    const joinUsers = getChatRoomData.data().joinUser.filter(u => u !== myUID );
    // console.log(joinUsers)

    const FCMTokens = await Promise.all(joinUsers.map(async uid => {
      try {
        const token = await firestore().collection('user').doc(uid).get();
        // console.log(token.data().FCMToken);
        return token.data().FCMToken;
      } catch (error) {
        console.log(error)
      }
    }))
    return FCMTokens;
    
  } catch (error) {
    console.log('getMemberFCMTokens : ',error)
  }
  
  
}