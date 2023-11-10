import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {signOut} from '../apis/auth';


function Logout({navigation, loginInfo}) {
  console.log(loginInfo);

  const handleLogout = async () => {
    // await signOut(); // 파이어베이스 로그아웃
    await fetch('http://nid.naver.com/nidlogin.logout') // 네이버 로그아웃
    await fetch('http://192.168.200.17:5300/naverlogin/logout') // 네이버 로그인 토큰삭제
    navigation.navigate('Landing');
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
