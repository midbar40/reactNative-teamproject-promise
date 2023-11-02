import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {signIn} from '../lib/auth';
// import { useNavigation } from '@react-navigation/native';

function Login({
  navigation,
  email,
  password,
  handleUserInfoChange,
  findEmail,
  setLoginInfo,
  setIsFindEmail,
  isFindEmail,
  isRegister,
  setIsRegister
}) {
  // const navigation = useNavigation();
  const loginAndMoveToApp = async () => {
    // 로그인 정보 확인
    if (email.trim() == '' || email.trim() == null) {
      return Alert.alert('이메일을 입력해주세요');
    } else if (password.trim() == '' || password.trim() == null) {
      return Alert.alert('비밀번호를 입력해주세요');
    } else {
      try {
        await signIn(email.trim(), password.trim());
        navigation.navigate('App', {email});
        setLoginInfo({email: '', password: ''});
      } catch (e) {
        console.log(e.code);
        if (e.code == 'auth/invalid-login') {
          Alert.alert('이메일 또는 비밀번호가 일치하지 않습니다');
        } else if (e.code == 'auth/user-not-found') {
          Alert.alert('존재하지 않는 이메일입니다');
        } else if (e.code == 'auth/wrong-password') {
          Alert.alert('비밀번호가 일치하지 않습니다');
        } else if (e.code == 'auth/invalid-email') {
          Alert.alert('이메일 형식이 올바르지 않습니다');
        } else {
          Alert.alert(`오류가 발생했습니다 error code: ${e.code}`);
          console.log(e.code, e.message);
        }
      }
      // 로그인 성공 시 App으로 이동
    }
  };
  return (
    <View style={styles.contentBox}>
      <Text style={styles.appName}>KAIROS</Text>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="이메일을 입력해주세요"
          placeholderTextColor={'#999'}
          value={email}
          onChangeText={value => handleUserInfoChange('email', value)}
          style={styles.input}
          textContentType={'emailAddress'}
        />
      </View>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor={'#999'}
          value={password}
          onChangeText={value => handleUserInfoChange('password', value)}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={loginAndMoveToApp}>
          <Text style={styles.loginBtn}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.GoogleButton}
          activeOpacity={0.7}
          onPress={loginAndMoveToApp}>
          <Text style={styles.GoogleLoginBtn}>Google 로그인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpAndFindEmail}>
        <TouchableOpacity
          onPress={() => {
            setIsFindEmail(false);
            setIsRegister(true);
          }}>
          <Text>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={findEmail}>
          <Text>이메일찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentBox: {
    flex: 1,
    width: '100%',
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
  loginBtnBox: {
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
  GoogleButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  GoogleLoginBtn: {
    fontSize: 18,
    color: 'white',
  },
  signUpAndFindEmail: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Login;
