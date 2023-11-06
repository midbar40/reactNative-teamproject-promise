/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import stackRouter from './stackRouter';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => stackRouter);
