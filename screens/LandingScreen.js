import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RegisterScreen from './RegisterScreen';
import {signIn, signUp} from '../lib/auth';

function LandingScreen({navigation}) {
    const [loginInfo, setLoginInfo] =useState({
        email: '',
        password: '',
    })
    console.log(loginInfo)
    const loginAndMoveToApp = async () => {
        // 로그인 정보 확인

        // 로그인 성공 시 App으로 이동
        navigation.navigate('App', {loginInfo})
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.appName}>KAIROS</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="이메일을 입력해주세요"
            placeholderTextColor={'#999'}
            value={loginInfo}
            onChangeText={setLoginInfo}
            style={styles.input}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호를 입력해주세요"
            placeholderTextColor={'#999'}
            value={loginInfo}
            onChangeText={setLoginInfo}
            style={styles.input}
          />
        </View>
        <View style={styles.loginBtnBox}>
          <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={loginAndMoveToApp}>
            <Text style={styles.loginBtn}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.GoogleButton} activeOpacity={0.7} onPress={loginAndMoveToApp}>
            <Text style={styles.GoogleLoginBtn}>Google 로그인</Text>
          </TouchableOpacity>
        </View>
        <View>
            <TouchableOpacity onPress={()=>navigation.navigate('Register')}>
                <Text>회원가입</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 600,
  },
  contentBox: {
    flex: 1,
    width: 400,
    height: 400,
    borderBlockColor: '#c7c7c7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#999',
    fontSize: 18,
    borderRadius: 10,
  },
  loginBtnBox:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginBtn: {
    fontSize: 18,
    color: 'white',
  },
  GoogleButton:{
    width: '80%',
    height: 50,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  GoogleLoginBtn:{
    fontSize: 18,
    color: 'white',
  }
});

export default LandingScreen;
