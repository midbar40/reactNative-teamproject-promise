import React, { useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {signIn, getUser} from '../apis/auth';

function WebScreen({route, navigation, naverLoginLink, setNaverLoginLink}) {
  const userInfo = {}
  const getUserInfo = async () => {
    // gpt가 짜준 코드
    try {
      const userResponse = await fetch(
        'http://192.168.200.17:5300/naverlogin/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      const userData = await userResponse.json(); // 데이터 수신을 기다림
      console.log('유저데이터(프론트32줄) :', userData);

      userInfo.email = userData.email;
      userInfo.password = userData.password;
      // setUserInfo({email: userData.email, password: userData.password}); // userInfo를 상위 스코프에서 접근 가능한 변수에 할당
      console.log('유저인포(프론트35줄) :', userInfo);

     if (userInfo && userInfo.email !==undefined && userInfo.password !==undefined) {
        signIn(userInfo?.email, userInfo?.password);
      }
      console.log('로그인 성공 :', userInfo);
    
        navigation.navigate('App');

    } catch (err) {
      console.log(err);
    }
}
  const showAfterLogin = async () => {
    console.log('유저정보 :', getUser())
    
    if(getUser() == null){
    await getUserInfo();
    } else {
      navigation.navigate('App');
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
          showAfterLogin();
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
