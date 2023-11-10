import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import cheerio from 'cheerio';

function SnsLogin({navigation, setNaverLoginLink, naverLoginLink, setIsSnsLogin}) {
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
            console.log('1차url :', data)
            return data.API_URL
          })
          .then(url => {
            console.log('2차url :', url)
            fetch(url)
              .then(res => res.text())
              .then(data => {
                console.log(data)
                const html = data;
                const $ = cheerio.load(html);
                const naverLoginLink = $('script').text().split('("')[1].split('")')[0]
                console.log('네이버 로그인 링크 :', naverLoginLink)
                fetch(naverLoginLink)
                .then(res => res.text())
                .then(data => {console.log(data)})
                }
                )
          
          })
        navigation.navigate('Web');
      } catch (err) {
        console.log(err);
      }
    };
    await getNaverLoginLink();
  };
  // console.log('sns로그인스테이트(SnsLogin컴포넌트) :', naverLoginLink); 

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
