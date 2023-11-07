import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

function WebScreen({isNaverLogin}) {
  // const {link} = route.params;
  // console.log(link);
  console.log(isNaverLogin)
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=nUrO0aft8rJsiODsTVJ3&redirect_uri=http://192.168.200.17:5300/naverlogin&state=8v5xohxsf4kgfd9z395b',
        }}
        style={{flex: 1, width: 415, height: 600}}
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
