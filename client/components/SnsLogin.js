import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

function SnsLogin({navigation, setNaverLoginLink, naverLoginLink}) {
  const googleLogin = () => {
    console.log('google 로그인');
  };

  const kakaoLogin = async () => {
    console.log('kakao 로그인');
  };

  const naverLogin = async () => {
    const getNaverLoginLink = async () => {
      try {
        await fetch('http://192.168.200.17:5300/naverlogin') // http://192.168.200.17:5300/naverlogin // http://192.168.0.172:5300/naverlogin
          .then(res => res.json())
          .then(data => {
            setNaverLoginLink(data.API_URL);
            fetch(data.API_URL, {
              headers: {
                method: 'GET',
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            })
              .then(res => {
    
                // res.json();
              })
              // .then(data => {
              //   console.log(data);
              // });
          });

        navigation.navigate('Web');
      } catch (err) {
        console.log(err);
      }
    };
    await getNaverLoginLink();
  };
  console.log('sns로그인스테이트 :' ,naverLoginLink)

  return (
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
  );
}
const styles = StyleSheet.create({
  loginBtnBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
