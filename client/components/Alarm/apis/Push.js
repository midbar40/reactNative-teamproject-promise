import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const configurePushNotifications = () => {  
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message:', remoteMessage);
    showNotification(remoteMessage.notification);
  });
  
  const showNotification = notification => {
    PushNotification.localNotification({
      title: notification.data.title,
      message: notification.data.body,
    });
  };
};

export { configurePushNotifications };