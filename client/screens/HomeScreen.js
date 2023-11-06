import React from 'react';
import {View, StyleSheet, SafeAreaView, Text, StatusBar} from 'react-native';
import Logout from '../components/Logout';

function HomeScreen({props, navigation, loginInfo}) {
  return (
    <SafeAreaView style={styles.container}>
      <Logout navigation={navigation} loginInfo={loginInfo} props={props} />
      <View>
        <Text style={styles.appName}>Take me home</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 30,
  },
});

export default HomeScreen;
