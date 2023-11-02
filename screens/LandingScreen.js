import React, {useState, useRef} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {FindEmail, Login, RegisterUser} from '../components';

function LandingScreen({navigation}) {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const [isFindEmail, setIsFindEmail] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const {email, password} = loginInfo;

  const handleUserInfoChange = (name, value) => {
    setLoginInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const findEmail = async () => {
    setIsFindEmail(!isFindEmail);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isFindEmail ? (
        <FindEmail
          email={email}
          handleUserInfoChange={handleUserInfoChange}
          navigation={navigation}
          setIsFindEmail={setIsFindEmail}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
      ) : isRegister ? (
        <RegisterUser 
          isFindEmail={isFindEmail}
          setIsFindEmail={setIsFindEmail}
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
        setIsFindEmail={setIsFindEmail}
        isFindEmail={isFindEmail}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 600,
  },
});

export default LandingScreen;
