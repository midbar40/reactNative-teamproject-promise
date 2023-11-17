import React, {useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {signOut, getUser} from '../apis/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Logout({
  navigation,
  userInfo,
  setUserInfo,
  setIsKakaoLogin,
  setIsNaverLogin,
  isKakaoLogin,
  isNaverLogin,
  setAppState,
}) {
  const homeIP = '192.168.0.172:5300';
  const academyIP = '192.168.200.17:5300';
  const saveStateToAsyncStorage = async () => {
    try {
      const myBoolean = false;
      await AsyncStorage.setItem('appState', JSON.stringify(myBoolean));
      setAppState(myBoolean);
    } catch (error) {
      // 에러 처리
    }
  };
  const handleLogout = async () => {
    console.log('로그인상태: ', getUser());
    await signOut(); // 파이어베이스 로그아웃
    if (isKakaoLogin) {
      await fetch(`http://${academyIP}/kakaologin/logout`);
      setIsKakaoLogin(false); // 카카오 로그인 상태 false
    } // 카카오 로그인 토큰삭제
    else if (isNaverLogin) {
      await fetch(`http://${academyIP}/naverlogin/logout`); // 네이버 로그인 토큰삭제
      await fetch('http://nid.naver.com/nidlogin.logout'); // 네이버 로그아웃
      setIsNaverLogin(false); // 네이버 로그인 상태 false
    }
    setUserInfo(null); // 유저정보 삭제
    await saveStateToAsyncStorage();
    console.log('로그아웃 되었습니다 :', getUser());
  };

  return (
    <View style={styles.logoutBtn}>
      <TouchableOpacity onPress={handleLogout}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
});

export default Logout;
