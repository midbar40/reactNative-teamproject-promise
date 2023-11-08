import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

function WebScreen({ route, navigation, naverLoginLink, setNaverLoginLink}) { 
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

          // console.log(navState);

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
