import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,

} from 'react-native';
import {signOut, getUser} from '../apis/auth';


function Logout({navigation, userInfo, setUserInfo, setIsKakaoLogin, setIsNaverLogin}) {
  const homeIP = '192.168.0.172:5300'
  const academyIP = '192.168.200.17:5300'

  const handleLogout = async () => {
    console.log('로그인상태: ', getUser());
    await signOut(); // 파이어베이스 로그아웃
    await fetch(`http://${homeIP}/naverlogin/logout`) // 네이버 로그인 토큰삭제
    await fetch('http://nid.naver.com/nidlogin.logout') // 네이버 로그아웃
    await fetch(`http://${homeIP}/kakaologin/logout`) // 카카오 로그인 토큰삭제
    setUserInfo(null) // 유저정보 삭제
    setIsKakaoLogin(false) // 카카오 로그인 상태 false
    setIsNaverLogin(false) // 네이버 로그인 상태 false
    console.log('로그아웃 되었습니다 :', getUser());
  
    navigation.navigate('Landing'); // landing state변경 해야함

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
