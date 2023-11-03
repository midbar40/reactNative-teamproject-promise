import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {signUp, verifyUserEmail} from '../apis/auth';

function RegisterUser({
  navigation,
  isFindPassword,
  setIsFindPassword,
  findEmail,
  setIsRegister,
  isRegister,
  setLoginInfo,
}) {
  const [registerInfo, setRegisterInfo] = useState({
    email: '',
    password: '',
    passwordCheck: '',
  });

  const handleRegisterInfoChange = (name, value) => {
    setRegisterInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const registerUser = async () => {
    // 이메일 유효성 검증, 정규표현식
    // let regex = new RegExp(
    //   '/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i',
    // );

    if (email.trim().length == 0 || email.trim() == null) {
      return Alert.alert('이메일을 입력해주세요');
    } 
    // else if (!regex.test(email.trim())) {
    //   return Alert.alert('이메일 형식이 올바르지 않습니다');
    // } 
    else if (password.trim().length ==0 || password.trim() == null) {
      return Alert.alert('비밀번호를 입력해주세요');
    } else if (!passwordCheck.trim() || passwordCheck.trim() == null) {
      return Alert.alert('비밀번호를 다시 입력해주세요');
    } else if (password.trim() !== passwordCheck.trim()) {
      return Alert.alert('비밀번호가 일치하지 않습니다');
    } else {
      try {
        signUp(email.trim(), password.trim(), passwordCheck.trim());
        Alert.alert('회원가입이 완료되었습니다', '로그인 화면으로 이동합니다');
        setIsFindPassword(false);
        setIsRegister(false);
        setLoginInfo({email: '', password: ''});
      } catch (e) {
        if (e.code == 'auth/email-already-in-use') {
          Alert.alert('이미 가입된 이메일입니다');
        } else if (e.code == 'auth/invalid-email') {
          console.log(e.code, e.message)
          Alert.alert('이메일 형식이 올바르지 않습니다');
        } else if (e.code == 'auth/weak-password') {
          Alert.alert('비밀번호는 6자리 이상이어야 합니다');
        } else {
          Alert.alert(`오류가 발생했습니다 error code: ${e.code}`);
          console.log(e.code, e.message);
        }
      }
    }
  };
  const {email, password, passwordCheck} = registerInfo;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.appName}>KAIROS</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="이메일을 입력해주세요"
            placeholderTextColor={'#999'}
            value={email}
            onChangeText={value => handleRegisterInfoChange('email', value)}
            style={styles.input}
            textContentType={'emailAddress'}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호를 입력해주세요"
            placeholderTextColor={'#999'}
            value={password}
            onChangeText={value => handleRegisterInfoChange('password', value)}
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호를 다시 입력해주세요"
            placeholderTextColor={'#999'}
            value={passwordCheck}
            onChangeText={value =>
              handleRegisterInfoChange('passwordCheck', value)
            }
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.registerBtnBox}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={registerUser}>
            <Text style={styles.registerBtn}>가입하기</Text>
          </TouchableOpacity>
        </View>
        <View></View>
        <View style={styles.signInAndFindEmail}>
          <TouchableOpacity
            onPress={() => {
              setIsFindPassword(false);
              setIsRegister(false);
              setLoginInfo({email: '', password: ''});
            }}>
            <Text>로그인하기</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={findEmail}>
            <Text>비밀번호찾기</Text>
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
  registerBtnBox: {
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
  },
  registerBtn: {
    fontSize: 18,
    color: 'white',
  },
  signInAndFindEmail: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
export default RegisterUser;
