import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {finduserEmail, getUser} from '../apis/auth';

function FindPassword({
  navigation,
  email,
  handleUserInfoChange,
  isFindPassword,
  setIsFindPassword,
  isRegister,
  setIsRegister,
  setLoginInfo,
}) {


  const findEmailAndSend = async () => {
    if (!email.trim() || email.trim() == null) {
      Alert.alert('이메일을 입력해주세요');
    }  else {
      try {
      
          await finduserEmail(email.trim());
          Alert.alert(
            '비밀번호 전송',
            '가입하신 이메일로 비밀번호 재설정 URL을 전송했습니다',
          );
          setIsFindPassword(!isFindPassword);
          setLoginInfo({email: '', password: ''});
        
          // Alert.alert('등록되지 않은 이메일입니다');
        
      } catch (e) {
        if (e.code == 'auth/invalid-email') {
          Alert.alert('이메일 형식이 올바르지 않습니다');
        } else if (e.code == 'auth/user-not-found') {
          Alert.alert('존재하지 않는 이메일입니다');
        } else {
          Alert.alert(`오류가 발생했습니다 error code: ${e.code}`);
          console.log(e.code, e.message);
        }
      }
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
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={findEmailAndSend}>
          <Text style={styles.loginBtn}>확인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpAndFindEmail}>
        <TouchableOpacity
          onPress={() => {
            setIsFindPassword(false);
            setIsRegister(true);
          }}>
          <Text>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsFindPassword(false);
            setIsRegister(false);
          }}>
          <Text>로그인하기</Text>
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
  signUpAndFindEmail: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default FindPassword;
