import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const configurePushNotifications = () => {
  // Initialize Firebase Cloud Messaging
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  // Handle foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message:', remoteMessage);
    showNotification(remoteMessage.notification);
  });
};

const showNotification = notification => {
  PushNotification.localNotification({
    title: notification.title,
    message: notification.body,
  });
};

export { configurePushNotifications };