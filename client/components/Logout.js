import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {signOut, getUser} from '../apis/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {deleteFCMTokenInFirebase} from '../apis/firebaseMessage';
// 리덕스
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsGoogleLogin,
  setIsKakaoLogin,
  setIsNaverLogin,
  setIsSnsLogin,
  setAppState,
} from '../redux_store/slices/stateSlice';

// asyncstorage(로컬 로그인 상태 저장, 앱 종료해도 로그인 상태 유지)
import AsyncStorage from '@react-native-async-storage/async-storage';

function Logout() {
  // redux store state 가져오기
  const {isKakaoLogin, isNaverLogin, isGoogleLogin} = useSelector(
    state => state.state,
  );
  const dispatch = useDispatch();

  // asyncstorage에 로그인 상태 저장
  const saveStateToAsyncStorage = async () => {
    try {
      const myBoolean = false;
      await AsyncStorage.setItem('appState', JSON.stringify(myBoolean));
      dispatch(setAppState(myBoolean));
    } catch (error) {
      // 에러 처리
    }
  };

  const storeLoginState = async () => {
    try {
      const myBoolean = JSON.stringify(false);
      await AsyncStorage.setItem('isLogin', myBoolean);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    console.log('로그인상태: ', getUser());
    deleteFCMTokenInFirebase(); // 유저의 FCM토큰을 삭제합니다.
    await signOut(); // 파이어베이스 로그아웃
    if (isKakaoLogin) {
      await fetch(
        `https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/kakaoLogin/logout`,
      );
      dispatch(setIsKakaoLogin(false)); // 카카오 로그인 상태 false
      dispatch(setIsSnsLogin(false)); // sns 로그인 상태 false
    } // 카카오 로그인 토큰삭제
    else if (isNaverLogin) {
      await fetch(
        `https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/naverLogin/logout`,
      ); // 네이버 로그인 토큰삭제
      await fetch('http://nid.naver.com/nidlogin.logout'); // 네이버 로그아웃
      dispatch(setIsNaverLogin(false)); // 네이버 로그인 상태 false
      dispatch(setIsSnsLogin(false)); // sns 로그인 상태 false
    } else if (isGoogleLogin) {
      await GoogleSignin.signOut();
      dispatch(setIsGoogleLogin(false));
      dispatch(setIsSnsLogin(false)); // sns 로그인 상태 false
    }
    await saveStateToAsyncStorage();
    await storeLoginState();
    console.log('로그아웃 되었습니다 :', getUser());
  };

  return (
    <View style={styles.logoutBtn}>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.font}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    position: 'absolute',
    right: 20,
    top: 30,
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold',
  },
});

export default Logout;
