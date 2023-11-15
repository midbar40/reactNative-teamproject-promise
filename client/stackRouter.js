import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import { View, StyleSheet, SafeAreaView, Text } from 'react-native';

import LandingScreen from './screens/LandingScreen';
import WebScreen from './screens/WebScreen';
import App from './App';

const Stack = createNativeStackNavigator();

function stackRouter() {
  const [isNaverLogin, setIsNaverLogin] = useState(false);
  const [isKakaoLogin, setIsKakaoLogin] = useState(false);
  const [naverLoginLink, setNaverLoginLink] = useState('');
  const [kakaoLoginLink, setKakaoLoginLink] = useState('');
  const [isSnsLogin, setIsSnsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    token: '',
  });
  console.log('스택라우터 :', userInfo);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}>
        {userInfo == null || userInfo.token == '' ? (
          <>
            <Stack.Screen name="Landing">
              {props => (
                <LandingScreen
                  {...props}
                  naverLoginLink={naverLoginLink}
                  setNaverLoginLink={setNaverLoginLink}
                  kakaoLoginLink={kakaoLoginLink}
                  setKakaoLoginLink={setKakaoLoginLink}
                  isSnsLogin={isSnsLogin}
                  setIsSnsLogin={setIsSnsLogin}
                  isKakaoLogin={isKakaoLogin}
                  setIsKakaoLogin={setIsKakaoLogin}
                  isNaverLogin={isNaverLogin}
                  setIsNaverLogin={setIsNaverLogin}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Web">
              {props => (
                <WebScreen
                  {...props}
                  naverLoginLink={naverLoginLink}
                  setNaverLoginLink={setNaverLoginLink}
                  kakaoLoginLink={kakaoLoginLink}
                  setKakaoLoginLink={setKakaoLoginLink}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  setIsKakaoLogin={setIsKakaoLogin}
                  setIsNaverLogin={setIsNaverLogin}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="App">
            {props => (
              <App
                {...props}
                isSnsLogin={isSnsLogin}
                setIsSnsLogin={setIsSnsLogin}
                isKakaoLogin={isKakaoLogin}
                setIsKakaoLogin={setIsKakaoLogin}
                isNaverLogin={isNaverLogin}
                setIsNaverLogin={setIsNaverLogin}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default stackRouter;
