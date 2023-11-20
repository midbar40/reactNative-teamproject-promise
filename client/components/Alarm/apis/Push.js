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
};

export { configurePushNotifications };