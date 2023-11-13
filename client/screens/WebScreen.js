import React, { useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {signIn} from '../apis/auth';

function WebScreen({route, navigation, naverLoginLink, setNaverLoginLink}) {
  const userInfoData = {};
  const [userInfo, setUserInfo] = useState({});

  const showAfterLogin = navState => {
    if (
      navState.url.includes(
        'https://nid.naver.com/oauth2.0/authorize?response_type=code&state',
      )
    ) 
    {
      // const getUserInfo = async () => {
      //   // gpt가 짜준 코드
      //   try {
      //     const userResponse = await fetch(
      //       'http://192.168.200.17:5300/naverlogin/user',
      //       {
      //         method: 'GET',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //         credentials: 'include',
      //       },
      //     );
  
      //     const userData = await userResponse.json(); // 데이터 수신을 기다림
      //     console.log('유저데이터(프론트33줄) :', userData);
      //     userInfoData.email = userData.email;
      //     userInfoData.password = userData.password;
      //     setUserInfo({email: userData.email, password: userData.password}); // userInfo를 상위 스코프에서 접근 가능한 변수에 할당
      //     console.log('userInfo 성공 :', userInfo);
  
      //     const listAllUsers = await fetch(
      //       'http://192.168.200.17:5300/firebaseLogin',
      //     );
      //     const userList = await listAllUsers.json();
      //   } catch (err) {
      //     console.log(err);
      //   }
      // };
      // getUserInfo();

      // if (userInfoData && userInfoData.email !==undefined && userInfoData.password !==undefined) {
      //   signIn(userInfoData?.email, userInfoData?.password);
      // }
      // console.log('로그인 성공 :', userInfoData);

      // navigation.goBack();
      // navigation.navigate('App');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: naverLoginLink,
        }}
        style={{flex: 1, width: 415, height: 600}}
        onNavigationStateChange={navState => {
          showAfterLogin(navState);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default WebScreen;
