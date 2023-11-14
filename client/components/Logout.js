import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {signOut, getUser} from '../apis/auth';


function Logout({navigation}) {


  const handleLogout = async () => {
    console.log('로그인상태: ', getUser());
      await signOut(); // 파이어베이스 로그아웃
      await fetch('http://192.168.200.17:5300/naverlogin/logout') // 네이버 로그인 토큰삭제
      await fetch('http://nid.naver.com/nidlogin.logout') // 네이버 로그아웃
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
