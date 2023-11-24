import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {signIn} from '../apis/auth';
// import { useNavigation } from '@react-navigation/native';
import SnsLogin from './SnsLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setIsSnsLogin, setAppState} from '../redux_store/slices/stateSlice';

function Login({
  navigation,
  email,
  password,
  handleUserInfoChange,
  findEmail,
  setLoginInfo,
  setIsFindPassword,
  setIsRegister,
}) {
  // 리덕스 상태값 가져오기
  const {isSnsLogin, appState} = useSelector(state => state.state);
  const dispatch = useDispatch();

  // asyncstorage에 로그인 상태 저장
  const saveStateToAsyncStorage = async () => {
    try {
      const myBoolean = true;
      await AsyncStorage.setItem('appState', JSON.stringify(myBoolean));
      dispatch(setAppState(myBoolean));
    } catch (error) {
      console.log('로컬 로그인에러 :', error);
    }
  };

  // const navigation = useNavigation();
  const loginAndMoveToApp = async () => {
    // 로그인 정보 확인
    if (!email.trim() || email.trim() == null) {
      return Alert.alert('이메일을 입력해주세요');
    } else if (!password.trim() || password.trim() == null) {
      return Alert.alert('비밀번호를 입력해주세요');
    } else {
      try {
        await signIn(email.trim(), password.trim());
        await saveStateToAsyncStorage();
        setLoginInfo({email: '', password: ''});
      } catch (e) {
        switch (e.code) {
          case 'auth/invalid-login':
            return Alert.alert('이메일 또는 비밀번호가 일치하지 않습니다');
          case 'auth/user-not-found':
            return Alert.alert('존재하지 않는 이메일입니다');
          case 'auth/wrong-password':
            return Alert.alert('비밀번호가 일치하지 않습니다');
          case 'auth/invalid-email':
            return Alert.alert('이메일 형식이 올바르지 않습니다');
          default:
            return '로그인이 처리되지 않았습니다';
        }
      }
      // 로그인 성공 시 App으로 이동
    }
  };
  const moveToSnsLogin = () => {
    dispatch(setIsSnsLogin(true));
  };
  return (
    <View style={styles.contentBox}>
      <StatusBar
        backgroundColor="#F2F2F2"
        barStyle={'dark-content'}></StatusBar>
      <Text style={styles.appName}>약속해줘</Text>
      {/* 🤙 */}
      {isSnsLogin ? (
        <SnsLogin
          navigation={navigation}
          setAppState={setAppState}
          appState={appState}
        />
      ) : (
        <>
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
          <View style={styles.inputBox}>
            <TextInput
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor={'#999'}
              value={password}
              onChangeText={value => handleUserInfoChange('password', value)}
              style={[styles.input, styles.font]}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.loginBtnBox}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={loginAndMoveToApp}>
              <Text style={[styles.loginBtn, styles.font]}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.snsLoginButton}
              activeOpacity={0.7}
              onPress={moveToSnsLogin}>
              <Text style={[styles.snsLoginBtn, styles.font]}>SNS 로그인</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={styles.signUpAndFindEmail}>
        <TouchableOpacity
          onPress={() => {
            setIsFindPassword(false);
            setIsRegister(true);
            setLoginInfo({email: '', password: ''});
          }}>
          <Text style={styles.font}>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={findEmail}>
          <Text style={styles.font}>비밀번호찾기</Text>
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
    // backgroundColor: '#fff',
  },
  appName: {
    fontSize: 60,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    // marginLeft: -80,
    fontFamily: 'ulsanjunggu',
    color: '#FAA6AA',
    padding: 5,
    // height: 48,
    letterSpacing: 4,
  },
  // appName1:{
  //   fontSize: 80,
  //   marginLeft: 0,
  //   color: '#3251DB',
  //   // height: 60,
  // },
  // appName2: {
  //   marginLeft: 80,
  //   marginTop: 1,
  //   marginBottom: 30,
  //   color: '#5D99DB',
  // },
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
  signUpAndFindEmail: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    // fontWeight: 'bold',
  },
  snsLoginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#CDDAC3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  snsLoginBtn: {
    fontSize: 18,
    color: 'white',
    // fontWeight: 'bold',
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold',
  },
});

export default Login;
