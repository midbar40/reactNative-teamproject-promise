import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import { View, StyleSheet, SafeAreaView, Text } from 'react-native';

import LandingScreen from './screens/LandingScreen';
import WebScreen from './screens/WebScreen';
import App from './App';

const Stack = createNativeStackNavigator();

function stackRouter() {
  const [naverLoginLink, setNaverLoginLink] = useState('');
  const [isSnsLogin, setIsSnsLogin] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Landing">
          {props => (
            <LandingScreen
              {...props}
              naverLoginLink={naverLoginLink}
              setNaverLoginLink={setNaverLoginLink}
              isSnsLogin={isSnsLogin}
              setIsSnsLogin={setIsSnsLogin}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="App">
          {props => (
            <App
              {...props}
              isSnsLogin={isSnsLogin}
              setIsSnsLogin={setIsSnsLogin}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Web">
          {props => (
            <WebScreen
              {...props}
              naverLoginLink={naverLoginLink}
              setNaverLoginLink={setNaverLoginLink}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default stackRouter;
