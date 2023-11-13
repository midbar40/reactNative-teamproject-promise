import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {signIn} from '../apis/auth';

function SnsLogin({
  navigation,
  setNaverLoginLink,
  naverLoginLink,
  setIsSnsLogin,
}) {
  const [userInfo, setUserInfo] = useState({});
  const userInfoData = {};
  const googleLogin = () => {
    console.log('google 로그인');
  };

  const kakaoLogin = async () => {
    console.log('kakao 로그인');
  };

  const naverLogin = async () => {
    const getNaverLoginLink = async () => {
      try {
        const response = await fetch('http://192.168.200.17:5300/naverlogin', 
        {
          cache: 'no-store',
        }
        );
        const data = await response.json();
        setNaverLoginLink(data.API_URL);
      } catch (err) {
        console.log(err);
      }
    };
    const getUserInfo = async () => {
      // gpt가 짜준 코드
      try {
        const userResponse = await fetch(
          'http://192.168.200.17:5300/naverlogin/user',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        const userData = await userResponse.json(); // 데이터 수신을 기다림
        console.log('유저데이터(프론트33줄) :', userData);
        userInfoData.email = userData.email;
        userInfoData.password = userData.password;
        setUserInfo({email: userData.email, password: userData.password}); // userInfo를 상위 스코프에서 접근 가능한 변수에 할당
        console.log('userInfo 성공 :', userInfo);

        const listAllUsers = await fetch(
          'http://192.168.200.17:5300/firebaseLogin',
        );
        const userList = await listAllUsers.json();
      } catch (err) {
        console.log(err);
      }
    };
    await getNaverLoginLink();
    await getUserInfo();
    if (userInfoData && userInfoData.email !==undefined && userInfoData.password !==undefined) {
      await signIn(userInfoData?.email, userInfoData?.password);
    }
    console.log('로그인 성공 :', userInfoData);

    navigation.navigate('Web');
  };

  return (
    <>
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => {
            setIsSnsLogin(false);
          }}>
          <Text style={styles.loginBtn}>가입된 아이디로 로그인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.GoogleButton}
          activeOpacity={0.7}
          onPress={googleLogin}>
          <Text style={styles.GoogleLoginBtn}>Google 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.KakaoButton}
          activeOpacity={0.7}
          onPress={kakaoLogin}>
          <Text style={styles.KakaoLoginBtn}>카카오 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.NaverButton}
          activeOpacity={0.7}
          onPress={naverLogin}>
          <Text style={styles.NaverLoginBtn}>네이버 로그인</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  loginBtnBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  GoogleButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  GoogleLoginBtn: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  KakaoButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#FEE500',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  KakaoLoginBtn: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  NaverButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#2DB400',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  NaverLoginBtn: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default SnsLogin;
