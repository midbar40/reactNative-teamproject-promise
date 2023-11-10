/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import stackRouter from './stackRouter';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging'
import { initializeApp } from '@react-native-firebase/app'
// import { firebaseConfig } from './firebaseConfig'

// initializeApp(firebaseConfig)

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
})

// Handle foreground messages
messaging().onMessage(async remoteMessage => {
  console.log('FCM Message Data:', remoteMessage.data);
  // Display the notification using your preferred library or custom code
})

messaging().onTokenRefresh(token => {
  console.log('FCM Token Refreshed:', token);
  // Send the new token to your server if needed
})

AppRegistry.registerComponent(appName, () => stackRouter);

