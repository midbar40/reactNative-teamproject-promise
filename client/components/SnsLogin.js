import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getUser} from '../apis/auth';
import {addUserData} from '../apis/firebase';
// asyncstorage(로컬 로그인 상태 저장, 앱 종료해도 로그인 상태 유지)
import AsyncStorage from '@react-native-async-storage/async-storage';
// 리덕스
import {useSelector, useDispatch} from 'react-redux';
import {
  setIsSnsLogin,
  setKakaoLoginLink,
  setNaverLoginLink,
  setIsGoogleLogin,
  setIsKakaoLogin,
  setIsNaverLogin,
  setAppState
} from '../redux_store/slices/stateSlice';

const googleSigninConfigure = async () => {
  GoogleSignin.configure({
    webClientId:
      '382249266253-ckb50ajbd96cjrlrq6078f9eu03dk2e1.apps.googleusercontent.com',
  });
};

function SnsLogin({navigation}) {
  // redux store state 가져오기
  const {isKakaoLogin, isNaverLogin, isGoogleLogin, appState} = useSelector(
    state => state.state,
  );
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

  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      // 구글로그인 진행코드
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      // 파이어스토어에 유저 데이터 추가
      await addUserData(getUser());
      // asyncstorage에 로그인 상태 저장
      await saveStateToAsyncStorage();
    } catch (err) {
      console.log('구글로그인 오류(snslogin.js 82번쨰줄) :', err);
    }
  };

  // 구글 로그인
  const googleLogin = async () => {
    dispatch(setIsGoogleLogin(true));
    dispatch(setIsKakaoLogin(false));
    dispatch(setIsNaverLogin(false));
    googleSigninConfigure();
    await signInWithGoogle();
  };

  const kakaoLogin = async () => {
    dispatch(setIsKakaoLogin(true));
    dispatch(setIsNaverLogin(false));
    dispatch(setIsGoogleLogin(false));
    // 카카오 로그인 웹뷰로 이동
    try {
      const response = await fetch(
        `https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/kakaoLogin`,
        {
          cache: 'no-store',
        },
      );
      dispatch(setKakaoLoginLink(response.url));
    } catch (err) {
      console.log(err);
    }
  };

  const naverLogin = async () => {
    dispatch(setIsNaverLogin(true));
    dispatch(setIsKakaoLogin(false));
    dispatch(setIsGoogleLogin(false));
    // 네이버 로그인 웹뷰로 이동
    const getNaverLoginLink = async () => {
      try {
        const response = await fetch(
          `https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/naverLogin`,
          {
            cache: 'no-store',
          },
        );
        const data = await response.json();
        dispatch(setNaverLoginLink(data.API_URL));
      } catch (err) {
        console.log(err);
      }
    };
    await getNaverLoginLink();
  };

  // 각 sns로그인 버튼 클릭시 state 값 변경해서 웹뷰로 이동
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
            dispatch(setIsSnsLogin(false));
          }}>
          <Text style={[styles.loginBtn, styles.font]}>
            가입된 아이디로 로그인
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginBtnBox}>
        <TouchableOpacity
          style={styles.GoogleButton}
          activeOpacity={0.7}
          onPress={googleLogin}>
          <Text style={[styles.GoogleLoginBtn, styles.font]}>
            Google 로그인
          </Text>
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
  },
});
export default SnsLogin;
