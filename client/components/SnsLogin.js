import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {signIn} from '../apis/auth';

function SnsLogin({
  navigation,
  setNaverLoginLink,
  setIsSnsLogin,
  setKakaoLoginLink,
  isKakaoLogin,
  setIsKakaoLogin,
  isNaverLogin,
  setIsNaverLogin,
}) {
  // const [isNaverLogin, setIsNaverLogin] = useState(false);
  // const [isKakaoLogin, setIsKakaoLogin] = useState(false);
  const homeIP = '192.168.0.172:5300'
  const academyIP = '192.168.200.17:5300'

  const googleLogin = () => {
    console.log('google 로그인');
  };

  const kakaoLogin = async () => {
    setIsKakaoLogin(true);
    setIsNaverLogin(false);
    try {
      const response = await fetch(`http://${homeIP}/kakaologin`, {
        cache: 'no-store',
      })
      setKakaoLoginLink(response.url);
    } catch (err) {
      console.log(err);
    }
  };

  const naverLogin = async () => {
    setIsNaverLogin(true);
    setIsKakaoLogin(false);
    const getNaverLoginLink = async () => {
      try {
        const response = await fetch(`http://${homeIP}/naverlogin`, {
          cache: 'no-store',
        });
        const data = await response.json();
        setNaverLoginLink(data.API_URL);
      } catch (err) {
        console.log(err);
      }
    };

    await getNaverLoginLink();
  };

  useEffect(() => {
    if (isKakaoLogin) {
      navigation.navigate('Web', {isKakaoLogin: isKakaoLogin});
    } else if (isNaverLogin) {
      navigation.navigate('Web', {isNaverLogin: isNaverLogin});
    }
  }, [isKakaoLogin, isNaverLogin]);

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
