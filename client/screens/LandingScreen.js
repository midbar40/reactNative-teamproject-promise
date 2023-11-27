import React, { useState} from 'react';
import {SafeAreaView, StyleSheet, ImageBackground} from 'react-native';
import {FindPassword, Login, RegisterUser} from '../components';

function LandingScreen({
  navigation,
  // setNaverLoginLink,
  // naverLoginLink,
  // isSnsLogin,
  // setIsSnsLogin,
  // kakaoLoginLink,
  // setKakaoLoginLink,
  // isKakaoLogin,
  // setIsKakaoLogin,
  // isNaverLogin,
  // setIsNaverLogin,
  // isGoogleLogin,
  // setIsGoogleLogin,
  appState,
  setAppState,
}) {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const [isFindPassword, setIsFindPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const {email, password} = loginInfo;

  const handleUserInfoChange = (name, value) => {
    setLoginInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const findEmail = async () => {
    setIsFindPassword(!isFindPassword);
    setLoginInfo({email: '', password: ''});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ImageBackground source={require('../assets/imgs/winter.jpg')} resizeMode='cover' style={styles.image}> */}
      {isFindPassword ? (
        <FindPassword
          email={email}
          handleUserInfoChange={handleUserInfoChange}
          navigation={navigation}
          setIsFindPassword={setIsFindPassword}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
          setLoginInfo={setLoginInfo}
        />
      ) : isRegister ? (
        <RegisterUser
          isFindPassword={isFindPassword}
          setIsFindPassword={setIsFindPassword}
          // setIsSnsLogin={setIsSnsLogin}
          findEmail={findEmail}
          navigation={navigation}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
          setLoginInfo={setLoginInfo}
        />
      ) : (
        <Login
          email={email}
          password={password}
          handleUserInfoChange={handleUserInfoChange}
          findEmail={findEmail}
          navigation={navigation}
          setLoginInfo={setLoginInfo}
          setIsFindPassword={setIsFindPassword}
          setIsRegister={setIsRegister}
          // setNaverLoginLink={setNaverLoginLink}
          // naverLoginLink={naverLoginLink}
          // kakaoLoginLink={kakaoLoginLink}
          // setKakaoLoginLink={setKakaoLoginLink}
          // isSnsLogin={isSnsLogin}
          // setIsSnsLogin={setIsSnsLogin}
          // isKakaoLogin={isKakaoLogin}
          // setIsKakaoLogin={setIsKakaoLogin}
          // isNaverLogin={isNaverLogin}
          // setIsNaverLogin={setIsNaverLogin}
          // isGoogleLogin={isGoogleLogin}
          // setIsGoogleLogin={setIsGoogleLogin}
          setAppState={setAppState}
          appState= {appState}
        />
      )}
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    height: 600,
  },
  image: {
    flex: 1,
    // justifyContent: "center"
  }
});

export default LandingScreen;
