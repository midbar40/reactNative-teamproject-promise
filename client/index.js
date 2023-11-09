/**
 * @format
 */
import { registerRootComponent } from 'expo'
import {AppRegistry} from 'react-native';
import App from './App';
import stackRouter from './stackRouter';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging'

messaging().setBackgroundMessageHandler(async message => {
  console.log(message)
})

AppRegistry.registerComponent(appName, () => stackRouter);
registerRootComponent(App)
