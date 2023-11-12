import React, { useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {signIn} from '../apis/auth';

function SnsLogin({navigation, setNaverLoginLink, naverLoginLink, setIsSnsLogin}) {
  const [userInfo, setUserInfo] = useState({})
  const googleLogin = () => {
    console.log('google 로그인');
  };

  const kakaoLogin = async () => {
    console.log('kakao 로그인');
  };

  const naverLogin = async () => {
    const getNaverLoginLink = async () => {
      try {
        const response = await fetch('http://192.168.0.172:5300/naverlogin');
        const data = await response.json();
        setNaverLoginLink(data.API_URL);
        console.log('1차url :', data.API_URL);

        // gpt가 짜준 코드
        const userResponse = await fetch('http://192.168.0.172:5300/naverlogin/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const userInfo = await userResponse.json(); // 데이터 수신을 기다림

      setUserInfo(userInfo); // userInfo를 상위 스코프에서 접근 가능한 변수에 할당
      console.log('프론트엔드 테스트:', userInfo);

      const listAllUsers = await fetch('http://192.168.0.172:5300/firebaseLogin')
      const userList = await listAllUsers.json()
      console.log('유저리스트 :', userList)

      if(userInfo.email && userInfo.password && userList.include(userInfo.email)) { // 등록이 되어있으면 로그인을 시도한다로 변경
        signIn(userInfo.email, userInfo.password); 
      }

       // 초기에 잘못짠 코드 : 비동기 처리 안되고 조잡함
        // fetch('http://192.168.0.172:5300/naverlogin/user', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   credentials: 'include',
        // })
        // .then((res) => 
        //   fetch(res.url)
        //   .then((res) => res.json())
        //   .then((userInfo) => {
        //     setUserInfo(userInfo)
        //   })
        // )
      } catch (err) {
        console.log(err);
      }
    };

    await getNaverLoginLink();
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
