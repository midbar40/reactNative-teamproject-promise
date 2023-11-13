import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {signIn} from '../apis/auth';

function WebScreen({ route, navigation, naverLoginLink, setNaverLoginLink}) { 
  const showAfterLogin = (navState) => {
    if(navState.url.includes('https://nid.naver.com/oauth2.0/authorize?response_type=code&state')){
      // sns 로그인 후 웹뷰 닫기
      navigation.goBack() // navigtaion.navigate(App)바로 써도 로그인이 유지된다면 이 코드는 필요없다, 찰나의 순간에 데이터가 나와버린다
      // firebase 로그인 함수 호출, firebase에 등록된 유저 이메일, 비밀번호 가져오기 how?
      // signIn('이메일', '비밀번호') // 네이버 로그인 시 fetch로 서버에서 아이디와 비밀번호를 가져와야한다.
      // 로그인 후 메인화면으로 이동
      navigation.navigate('App')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <WebView
        source={{
          uri: naverLoginLink
        }}
        style={{flex: 1, width: 415, height: 600}}
        onNavigationStateChange={(navState) => {
          showAfterLogin(navState)
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
