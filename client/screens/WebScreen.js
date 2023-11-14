import React, {useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {signIn, getUser} from '../apis/auth';

function WebScreen({route, navigation, naverLoginLink, kakaoLoginLink}) {
  let isNaverLogin = route.params?.isNaverLogin;
  let isKakaoLogin = route.params?.isKakaoLogin;
  console.log(' 라우트params :', route.params);
  console.log('isNaverLogin :', isNaverLogin);
  console.log('isKakaoLogin :', isKakaoLogin);
  const userInfo = {};
  // 네이버 유저정보 가져오기
  const getNaverUserInfo = async () => {
    // gpt가 짜준 코드
    try {
      const userResponse = await fetch(
        'http://192.168.200.17:5300/naverlogin/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'cache-control':'no-cache, must-revalidate, post-check=0, pre-check=0',
          },
          credentials: 'include',
          cache: 'no-store',
        },
      );

      const userData = await userResponse.json(); // 데이터 수신을 기다림
      console.log('유저데이터(프론트32줄) :', userData);

      userInfo.email = userData.email;
      userInfo.password = userData.password;
      // setUserInfo({email: userData.email, password: userData.password}); // userInfo를 상위 스코프에서 접근 가능한 변수에 할당
      console.log('유저인포(프론트35줄) :', userInfo);

      if (
        userInfo &&
        userInfo.email !== undefined &&
        userInfo.password !== undefined
      ) {
        signIn(userInfo?.email, userInfo?.password);
      }
      console.log('로그인 성공 :', userInfo);

      navigation.navigate('App');
    } catch (err) {
      console.log(err);
    }
  };

  // 네이버 로그인
  const showNaverLogin = async () => {
    console.log('유저정보 :', getUser());

    if (getUser() == null) {
      await getNaverUserInfo();
    } else {
      navigation.navigate('App');
    }
  };

  // 카카오 로그인
  const showKakaoLogin = async () => {
    try {
      const response = await fetch(
        'http://192.168.200.17:5300/kakaologin/profile',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'cache-control':
              'no-cache, must-revalidate, post-check=0, pre-check=0',
          },
          credentials: 'include',
          cache: 'no-store',
        },
      );
      const finalResponse = await fetch(response.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'cache-control':
            'no-cache, must-revalidate, post-check=0, pre-check=0',
        },
        credentials: 'include',
        cache: 'no-store',
      });
      console.log('카카오 유저데이터 :', finalResponse);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: isNaverLogin
            ? naverLoginLink
            : isKakaoLogin
            ? kakaoLoginLink
            : null,
        }}
        style={{flex: 1, width: 415, height: 600}}
        onNavigationStateChange={navState => {
          if (isNaverLogin) {
            showNaverLogin();
          } else if (isKakaoLogin) {
            showKakaoLogin();
          }
        }}
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
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
