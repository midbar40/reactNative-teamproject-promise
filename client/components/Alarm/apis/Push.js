import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const configurePushNotifications = () => {  
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('백그라운드 메세지', remoteMessage);
  });
  
  messaging().onMessage(async remoteMessage => {
    console.log('포그라운드 메세지', remoteMessage);
    showNotification(remoteMessage.notification);
  });
  
  const showNotification = (notification) => {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body,
    });
  };

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('백그라운드 상태 열림:', remoteMessage.notification);
    
  })

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        
      }
    })
};

export { configurePushNotifications };