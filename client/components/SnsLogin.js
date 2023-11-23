import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {signIn,getUser} from '../apis/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const googleSigninConfigure = async () => {
  GoogleSignin.configure({
    webClientId:
      '382249266253-ckb50ajbd96cjrlrq6078f9eu03dk2e1.apps.googleusercontent.com',
  });
};

function SnsLogin({
  navigation,
  setNaverLoginLink,
  setIsSnsLogin,
  setKakaoLoginLink,
  isKakaoLogin,
  setIsKakaoLogin,
  isNaverLogin,
  setIsNaverLogin,
  isGoogleLogin,
  setIsGoogleLogin,
  appState,
  setAppState,
}) {
  const homeIP = '192.168.0.172:5300';
  const academyIP = '192.168.200.17:5300';

  const saveStateToAsyncStorage = async () => {
    try {
      const myBoolean = true;
      await AsyncStorage.setItem('appState', JSON.stringify(myBoolean));
      setAppState(myBoolean);
    } catch (error) {
      console.log('로컬 로그인에러 :', error);
    }
  };

  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the user's ID token
      const {idToken} = await GoogleSignin.signIn();
      console.log('구글 토큰 :', idToken);
      const userInfoFromGoogle = await GoogleSignin.getCurrentUser();
      console.log('구글 유저정보 :', userInfoFromGoogle.user);

      await fetch(`http://${academyIP}/firebaseLogin/googleSignUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfoFromGoogle.user.email,
          password: userInfoFromGoogle.user.email + 'secret',
          displayName: userInfoFromGoogle.user.name,
        }),
      });

      await signIn(
        userInfoFromGoogle.user.email,
        userInfoFromGoogle.user.email + 'secret',
      );
      await saveStateToAsyncStorage();
      console.log('구글 로그인 성공', getUser());
    } catch (err) {
      console.log('구글로그인 오류(snslogin.js 82번쨰줄) :', err);
    }
  };

  // 구글 로그인
  const googleLogin = async () => {
    setIsGoogleLogin(true);
    googleSigninConfigure();
    setIsKakaoLogin(false);
    setIsNaverLogin(false);
    await signInWithGoogle();
  };

  const kakaoLogin = async () => {
    setIsKakaoLogin(true);
    setIsNaverLogin(false);
    try {
      const response = await fetch(`http://${academyIP}/kakaologin`, {
        cache: 'no-store',
      });
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
        const response = await fetch(`http://${academyIP}/naverlogin`, {
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
  }, [isKakaoLogin, isNaverLogin, isGoogleLogin]);

  return (
    <>
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => {
            setIsSnsLogin(false);
          }}>
          <Text style={[styles.loginBtn, styles.font]}>가입된 아이디로 로그인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.GoogleButton}
          activeOpacity={0.7}
          onPress={googleLogin}>
          <Text style={[styles.GoogleLoginBtn, styles.font]}>Google 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.KakaoButton}
          activeOpacity={0.7}
          onPress={kakaoLogin}>
          <Text style={[styles.KakaoLoginBtn, styles.font]}>카카오 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.NaverButton}
          activeOpacity={0.7}
          onPress={naverLogin}>
          <Text style={[styles.NaverLoginBtn, styles.font]}>네이버 로그인</Text>
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
    backgroundColor: '#F7CAC9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    fontSize: 18,
    color: 'white',
    // fontWeight: 'bold',
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
    // fontWeight: 'bold',
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
    // fontWeight: 'bold',
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
    // fontWeight: 'bold',
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold',
  }
});
export default SnsLogin;
