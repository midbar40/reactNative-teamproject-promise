import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {finduserEmail, getUser} from '../apis/auth';
console.log(getUser());

function FindPassword({
  email,
  handleUserInfoChange,
  setIsFindPassword,
  setIsRegister,
}) {

  const [userEmail, setUserEmail] = useState([]); // 가입된 이메일 목록
  const findEmailAndSend = async () => {
    try {
      if (userEmail.includes(email.trim())) { // 가입된 이메일 목록에 입력한 이메일이 있는지 확인
        await finduserEmail(email.trim());
        Alert.alert('비밀번호 재설정', '등록된 이메일로 비밀번호 재설정 링크를 전송했습니다.');
        setIsFindPassword(false);
        setIsRegister(false);
      } else {
        Alert.alert('등록되지 않은 이메일입니다.');
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    try {
      async function fetchData() {
        await fetch(`https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/firebaseLogin`)  // 사용하고 있는 컴퓨터의 ip주소로 변경(ipv4 주소 확인 방법: cmd -> ipconfig)
          .then(res => res.json())
          .then(data => {
            // console.log(data);
            setUserEmail(data);
          });
      }
      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <View style={styles.contentBox}>
      <StatusBar backgroundColor="#F2F2F2" barStyle={'dark-content'}></StatusBar>
      <Text style={styles.appName}>약속해줘</Text>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="이메일을 입력해주세요"
          placeholderTextColor={'#999'}
          value={email}
          onChangeText={value => handleUserInfoChange('email', value)}
          style={[styles.input, styles.font]}
          textContentType={'emailAddress'}
        />
      </View>
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={findEmailAndSend}>
          <Text style={[styles.loginBtn, styles.font]}>확인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signUpAndFindEmail}>
        <TouchableOpacity
          onPress={() => {
            setIsFindPassword(false);
            setIsRegister(true);
          }}>
          <Text style={styles.font}>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsFindPassword(false);
            setIsRegister(false);
          }}>
          <Text style={styles.font}>로그인하기</Text>
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
    fontSize: 55,
    fontFamily: 'ulsanjunggu',
    color: '#FAA6AA',
    // fontWeight: 'bold',
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
    backgroundColor: '#F7CAC9',
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
  font: {
    fontFamily: 'IM_Hyemin-Bold',
  }
});

export default FindPassword;
