import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {signIn, getUser} from '../apis/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

//리덕스
import {useSelector, useDispatch} from 'react-redux';
import {
  setIsGoogleLogin,
  setIsKakaoLogin,
  setIsNaverLogin,
  setAppState,
} from '../redux_store/slices/stateSlice';

function WebScreen({route}) {
  // 리덕스 상태값 가져오기
  const {naverLoginLink, kakaoLoginLink} = useSelector(state => state.state);
  const dispatch = useDispatch();

  let isNaverLogin = route.params?.isNaverLogin;
  let isKakaoLogin = route.params?.isKakaoLogin;

  const saveStateToAsyncStorage = async () => {
    try {
      const myBoolean = true;
      await AsyncStorage.setItem('appState', JSON.stringify(myBoolean));
      dispatch(setAppState(myBoolean));
    } catch (error) {
      console.log('로컬 로그인에러 :', error);
    }
  };
  // 네이버 유저정보 가져오기
  const getNaverUserInfo = async () => {
    // gpt가 짜준 코드
    try {
      const userResponse = await fetch(
        `https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/naverLogin/user`,
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

      const userData = await userResponse?.json(); // 데이터 수신을 기다림

      const updatedUserInfo = {
        email: userData.email,
        password: userData.email + 'secret',
        token: userData.token,
      };

      if (updatedUserInfo?.token) {
        await signIn(updatedUserInfo?.email, updatedUserInfo?.password);
        await saveStateToAsyncStorage();
      } else {
        console.log('로그인 실패 :', updatedUserInfo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 네이버 로그인
  const showNaverLogin = async () => {
    if (getUser() == null) {
      await getNaverUserInfo();
    }
  };

  const getKakaoUserInfo = async () => {
    try {
      const response = await fetch(
        `https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/kakaoLogin/profile`,
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
      const userData = await response?.json();

      const updatedUserInfo = {
        email: userData.email,
        password: userData.password,
        token: userData.token,
      };

      if (updatedUserInfo?.token) {
        await signIn(updatedUserInfo?.email, updatedUserInfo?.password);
        await saveStateToAsyncStorage();
      } else {
        console.log('로그인 실패 :', getUser());
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 카카오 로그인
  const showKakaoLogin = async () => {
    if (getUser() == null) {
      await getKakaoUserInfo();
    } else {
      console.log('카카오 로그인 실패 :', getUser());
    }
  };

  // 카카오, 네이버 state 초기화
  const handleNaverKakaoState = () => {
    dispatch(setIsKakaoLogin(false));
    dispatch(setIsNaverLogin(false));
    dispatch(setIsGoogleLogin(false));
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
