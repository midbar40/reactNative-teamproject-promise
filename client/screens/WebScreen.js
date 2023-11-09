import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {signIn} from '../apis/auth';

function WebScreen({ route, navigation, naverLoginLink, setNaverLoginLink}) { 
  const showAfterLogin = (navState) => {
    console.log(navState.url.includes('code'))
    if(navState.url.includes('https://nid.naver.com/oauth2.0/authorize?response_type=code&state')){
      // sns 로그인 후 웹뷰 닫기
      navigation.goBack()
      // firebase 로그인 함수 호출, firebase에 등록된 유저 이메일, 비밀번호 가져오기 how?
      signIn('이메일', '비밀번호') 
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
          // console.log(navState.url);
          // console.log('navState.url :', navState.url);
          showAfterLogin(navState)
          console.log(navState);

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
