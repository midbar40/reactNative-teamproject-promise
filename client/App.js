import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {signOut, getUser} from './apis/auth';
import {
  HomeScreen,
  CalendarScreen,
  AlarmScreen,
  TodoScreen,
  ChatScreen,
} from './screens';

import Icon from 'react-native-vector-icons/Ionicons.js';
import Icon2 from 'react-native-vector-icons/FontAwesome6.js';

import messaging from '@react-native-firebase/messaging';

import PushNotification from 'react-native-push-notification';
import {configurePushNotifications} from './components/Alarm/apis/Push';
import {
  getToken,
  notificationListener,
  requestUserPermission,
} from './apis/firebaseMessage';

const Tab = createBottomTabNavigator();
function App({
  navigation,
  route,
  isSnsLogin,
  setIsSnsLogin,
  isKakaoLogin,
  setIsKakaoLogin,
  isNaverLogin,
  setIsNaverLogin,
  userInfo,
  setUserInfo,
  setAppState,
  appState
}) {
  // console.log(route.params.email)

  const [isLogin, setIsLogin] = useState(false);
  const [selectRoomId, setSelectRoomId] = useState('');
  console.log('앱화면 유저인포', userInfo)

  /////////////////////////////////////////////////////////////
  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);
      } catch (error) {
        console.error('푸시알림 등록중 오류: ', error);
      }
    };
    registerForPushNotifications();
  }, []);
  // 로그아웃
  const handleLogout = async () => {
    const homeIP = '192.168.0.172:5300';
    const academyIP = '192.168.200.17:5300';
    console.log('로그인상태: ', getUser());
    await signOut(); // 파이어베이스 로그아웃
    if (isKakaoLogin) {
      await fetch(`http://${academyIP}/kakaologin/logout`);
      setIsKakaoLogin(false); // 카카오 로그인 상태 false
    } // 카카오 로그인 토큰삭제
    else if (isNaverLogin) {
      await fetch(`http://${academyIP}/naverlogin/logout`); // 네이버 로그인 토큰삭제
      await fetch('http://nid.naver.com/nidlogin.logout'); // 네이버 로그아웃
      setIsNaverLogin(false); // 네이버 로그인 상태 false
    }
    setUserInfo(null); // 유저정보 삭제
    console.log('로그아웃 되었습니다 :', getUser());
  };
  
 
  useEffect(() => {
    const handleForegroundNotifications = async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
      showNotification(remoteMessage.notification);
    };

    const unsubscribeForeground = messaging().onMessage(
      handleForegroundNotifications,
    );

    return () => {
      unsubscribeForeground();
    };
  }, []);

  useEffect(() => {
    const handleTokenRefresh = async newToken => {
      console.log('Token refreshed:', newToken);
    };

    const unsubscribeRefresh = messaging().onTokenRefresh(handleTokenRefresh);

    return () => {
      unsubscribeRefresh();
    };
  }, []);

  const showNotification = notification => {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body,
    });
  };

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    if (getUser() !== null) getToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'skyblue',
      }}>
      <Tab.Screen
        name="Home"
        // component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}>
        {props => (
          <HomeScreen
            {...props}
            navigation={navigation}
            isSnsLogin={isSnsLogin}
            setIsSnsLogin={setIsSnsLogin}
            isKakaoLogin={isKakaoLogin}
            setIsKakaoLogin={setIsKakaoLogin}
            isNaverLogin={isNaverLogin}
            setIsNaverLogin={setIsNaverLogin}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setAppState={setAppState}
            appState={appState}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Calendar"
        children={props => (
          <CalendarScreen
            navigation={navigation}
            setSelectRoomId={setSelectRoomId}
          />
        )}
        options={{
          title: 'Calendar',
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar-number" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{
          title: 'Alarm',
          tabBarIcon: ({color, size}) => (
            <Icon name="alarm" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          title: 'Todo',
          tabBarIcon: ({color, size}) => (
            <Icon2 name="clipboard-list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        children={props => (
          <ChatScreen
            {...props}
            selectRoomId={selectRoomId}
            setSelectRoomId={setSelectRoomId}
          />
        )}
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="chatbubbles-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default App;
