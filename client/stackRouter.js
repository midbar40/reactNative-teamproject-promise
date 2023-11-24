import React, {useState, useEffect} from 'react';
import {View,Text, StyleSheet, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingScreen from './screens/LandingScreen';
import WebScreen from './screens/WebScreen';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function stackRouter({navigation, route}) {
  const [appState, setAppState] = useState(false); 
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [isNaverLogin, setIsNaverLogin] = useState(false);
  const [isKakaoLogin, setIsKakaoLogin] = useState(false);
  const [naverLoginLink, setNaverLoginLink] = useState('');
  const [kakaoLoginLink, setKakaoLoginLink] = useState('');
  const [isSnsLogin, setIsSnsLogin] = useState(false);
  const [loading, setloading] = useState(true);

  // AsyncStorage에 로그인 appState 가져오기
  const getIsLoginState = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('appState');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e)
    }
  };

// 랜딩에서 AsyncStorage에 저장된 appState 값 가져오기
useEffect(() => {
  const getStorageData = async () => {
    try{
      const isLogin = await getIsLoginState();
      setAppState(isLogin);
      setloading(false)
    }catch(e){
      console.log(e);
    }
  }
  getStorageData()
},[])
console.log('스택라우터앱스테이트 : ', appState)


  if(loading){
    return (
      <>
      <View style={styles.container}>
        <Text style={styles.appName}>약속해줘</Text>
      </View>
      <View>
        <Image 
        source={require('./assets/imgs/finger1.png')}
        />
      </View>
      </>
    )
  }

  return (
    <NavigationContainer >
      <Stack.Navigator
        initialRouteName= 'Landing'
        screenOptions={{
          headerShown: false,
        }}>
        {!appState ? (
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
                  isGoogleLogin={isGoogleLogin}
                  setIsGoogleLogin={setIsGoogleLogin}
                  setAppState={setAppState}
                  appState={appState}
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
                isGoogleLogin={isGoogleLogin}
                setIsGoogleLogin={setIsGoogleLogin}
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

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 55,
    fontFamily: 'ulsanjunggu',
    color: '#FAA6AA',
    // fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
})

export default stackRouter;
