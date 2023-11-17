import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingScreen from './screens/LandingScreen';
import WebScreen from './screens/WebScreen';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUser, signOut} from './apis/auth';

const Stack = createNativeStackNavigator();

function stackRouter({navigation, route}) {
  const [appState, setAppState] = useState(false);

  const loadStateFromAsyncStorage = async () => {
    try {
      const serializedState = await AsyncStorage.getItem('appState');
      const myBoolean = JSON.parse(serializedState);
      if (serializedState === null) {
        return undefined; // 저장된 상태 값이 없으면 undefined 반환
      }
      return JSON.parse(serializedState);
    } catch (error) {
      return undefined; // 에러 처리
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.includes('appState')) {
          const res = await AsyncStorage.getItem('appState');
          setAppState(res);
        } else {
          console.log('appState 키가 존재하지 않습니다.');
          // appState 키가 존재하지 않는 경우에 대한 처리를 추가할 수 있습니다.
        }
      } catch (error) {
        console.error('로컬스토리지에서 값 불러오는 도중 오류 발생: ', error);
        // 여기서 오류를 적절하게 처리하거나 fallback 로직을 구현할 수 있습니다.
      }
    };
    fetchData();
  }, []);
  console.log('스택라우터 appState', appState);

  return (
    <NavigationContainer key={appState}>
      <Stack.Navigator
        initialRouteName={appState ? 'App' : 'Landing'}
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
                  setUserInfo={setUserInfo}
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
                  setAppState={setAppState}
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
                setAppState={setAppState}
                appState={appState}
              />
            )
            }
          </Stack.Screen>
       )} 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default stackRouter;
