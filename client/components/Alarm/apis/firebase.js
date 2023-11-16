import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { getUser } from '../../../apis/auth'
import { SERVER_KEY } from '@env'
import messaging from '@react-native-firebase/messaging'

const getRef = (collections) => {
  return firestore().collection(collections)
}
export const addData = async (collections, data) => {
  await getRef(collections).doc(data.id).set(data)
  console.log(`${collections} : ${JSON.stringify(data)} 파이어베이스에 추가!`)
}
export const updateDate = async (collections, id, data) => {
  await getRef(collections).doc(id).update(data)
}
export const removeData = async (collections, id) => {
  await getRef(collections).doc(id).delete()
  console.log(`${collections} : ${JSON.stringify(id)} 파이어베이스에서 삭제!`)
}
export const getCollection = (collections, onResult, onError, query, order, limit) => {
  let ref = getRef(collections)

  // 조건쿼리
  if (query && query.exists && query.condition && query.condition.length !== 0) {
    for (let cond of query.condition) {
      ref = ref.where(...cond)
    }
  }
  if (order && order.exists && order.condition && order.condition.length !== 0) {
    ref = ref.orderBy(...order.condition)
  }
  if (limit && limit.exists && limit.condition) {
    ref = ref.limit(limit.condition)
  }
  return ref.onSnapshot(onResult, onError)
}
export const getCurrentTime = () => {
  return firestore.FieldValue.serverTimestamp()
}

export const changeTimeFormat = (date) => {
  return firestore.Timestamp.fromDate(date)
}

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // navigation.navigate(remoteMessage.data.type);
    if (remoteMessage.data.type) {
      navigation.navigate(remoteMessage.data.type);
    }
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
        if (remoteMessage.data.type) {          
          navigation.navigate(remoteMessage.data.type);
        }
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

export const pushNotification = async (message) => {
  const myUID = getUser().uid;
  console.log(myUID)
  FCMTokens.forEach(t => {
    try {
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVER_KEY}`
        },
        body: JSON.stringify({
          "to": `${t}`,
          "notification": {
            "title": `테스트`,
            "body": `테스트합니다.`,
            "mutable_content": true,
            "sound": "Tri-tone"
          }
        })
      })
        .catch(e => console.log(e))
        .then(r => console.log(r))
    } catch (error) {
      console.log('noti error : ', error)
    }
  })
}