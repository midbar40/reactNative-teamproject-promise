import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {signOut} from '../apis/auth';

function Logout({navigation, loginInfo}) {
  console.log(loginInfo);

  const handleLogout = async () => {
    await signOut();
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
