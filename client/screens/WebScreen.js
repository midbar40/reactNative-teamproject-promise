import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {signIn, getUser} from '../apis/auth';

function WebScreen({
  route,
  navigation,
  naverLoginLink,
  kakaoLoginLink,
  userInfo,
  setUserInfo,
  setIsKakaoLogin,
  setIsNaverLogin,
}) {
  const homeIP = '192.168.0.172:5300';
  const academyIP = '192.168.200.17:5300';
  let isNaverLogin = route.params?.isNaverLogin;
  let isKakaoLogin = route.params?.isKakaoLogin;

  console.log(' 라우트params :', route.params);
  console.log('isNaverLogin :', isNaverLogin);
  console.log('isKakaoLogin :', isKakaoLogin);
  // 네이버 유저정보 가져오기
  const getNaverUserInfo = async () => {
    // gpt가 짜준 코드
    try {
      const userResponse = await fetch(`http://${academyIP}/naverlogin/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'cache-control':
            'no-cache, must-revalidate, post-check=0, pre-check=0',
        },
        credentials: 'include',
        cache: 'no-store',
      });

      const userData = await userResponse?.json(); // 데이터 수신을 기다림
      // console.log('유저데이터(프론트32줄) :', userData);

      const updatedUserInfo = {
        email: userData.email,
        password: userData.email + 'secret',
        token: userData.token,
      };
      // console.log('유저인포(프론트35줄) :', updatedUserInfo);
      
      if (updatedUserInfo?.token) {
        setUserInfo(updatedUserInfo); // userInfo를 상위 스코프에서 접근 가능한 변수에 할당
        // console.log('로그인 시도 :', updatedUserInfo.token);
        await signIn(updatedUserInfo?.email, updatedUserInfo?.password);
        console.log('로그인 성공 54번째 겟유저 :', getUser());
        if(getUser() !== null) return navigation.navigate('App');
      } else {
        console.log('로그인 실패 :', updatedUserInfo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 네이버 로그인
  const showNaverLogin = async () => {
    // console.log('유저정보 :', getUser());
    // console.log('token정보 :', userInfo?.token);
    if (getUser() == null || !userInfo?.token) {
      await getNaverUserInfo();
    } 
  };

  const getKakaoUserInfo = async () => {
    try {
      const response = await fetch(`http://${academyIP}/kakaologin/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'cache-control':
            'no-cache, must-revalidate, post-check=0, pre-check=0',
        },
        credentials: 'include',
        cache: 'no-store',
      });
      const userData = await response?.json();

      console.log('카카오 유저데이터 :', userData);

      const updatedUserInfo = {
        email: userData.email,
        password: userData.password,
        token: userData.token,
      };
      setUserInfo(updatedUserInfo);

      if (updatedUserInfo?.token) {
        console.log('로그인 시도 :', updatedUserInfo);
        signIn(updatedUserInfo?.email, updatedUserInfo?.password);
        console.log('로그인 성공 (101번째 겟유저):', getUser());
        if(getUser() !== null) return navigation.navigate('App');

      } else {
        console.log('로그인 실패 :', getUser());
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 카카오 로그인
  const showKakaoLogin = async () => {
    if (getUser() == null || !userInfo?.token) {
      await getKakaoUserInfo();
    } else {
      console.log('카카오 로그인 실패 :', getUser());
    }
  };

  // 카카오, 네이버 state 초기화
  const handleNaverKakaoState = () => {
    setIsKakaoLogin(false);
    setIsNaverLogin(false);
  };


  // 카카오/네이버로그인 화면에서 뒤로가기 버튼 눌렀을 때
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleNaverKakaoState);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleNaverKakaoState,
      );
    };
  }, []);

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
