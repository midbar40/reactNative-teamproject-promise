/**
 * @format
 */

import {AppRegistry} from 'react-native';
import StackRouter from './StackRouter';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

import {Provider} from 'react-redux';
import store from './redux_store/store';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const ReduxApp = () => (
  <Provider store={store}>
    <StackRouter />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
