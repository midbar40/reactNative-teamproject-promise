/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import stackRouter from './stackRouter';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // messaging().onMessage(remoteMessage)
});

// messaging().onMessage(remoteMessage)

AppRegistry.registerComponent(appName, () => stackRouter);
