import React, {useEffect, useState} from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {HomeScreen, CalendarScreen, AlarmScreen, TodoScreen, ChatScreen} from './screens';

import Icon from 'react-native-vector-icons/Ionicons.js'
import Icon2 from 'react-native-vector-icons/FontAwesome6.js'

import messaging from '@react-native-firebase/messaging';


import PushNotification from 'react-native-push-notification';
import { configurePushNotifications } from './components/Alarm/apis/Push';
import { getToken, notificationListener, requestUserPermission } from './apis/firebaseMessage';
import { getUser } from './apis/auth';

const Tab = createBottomTabNavigator();

function App({navigation, route, isSnsLogin, setIsSnsLogin, isKakaoLogin, setIsKakaoLogin, isNaverLogin, setIsNaverLogin, userInfo, setUserInfo}) {

  // console.log(route.params.email)

  const [isLogin, setIsLogin] = useState(false);
  const [selectRoomId, setSelectRoomId] = useState('');


  /////////////////////////////////////////////////////////////
  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages()
        const fcmToken = await messaging().getToken()
        console.log('FCM Token:', fcmToken)
      } catch (error) {
        console.error('푸시알림 등록중 오류: ', error)
      }
    }
    registerForPushNotifications()
  }, [])

  useEffect(() => {
    const handleForegroundNotifications = async (remoteMessage) => {
      console.log('Foreground Message:', remoteMessage);
      showNotification(remoteMessage.notification);
    };

    const unsubscribeForeground = messaging().onMessage(handleForegroundNotifications);

    return () => {
      unsubscribeForeground();
    };
  }, [])

  useEffect(() => {
    const handleTokenRefresh = async (newToken) => {
      console.log('Token refreshed:', newToken);
    };

    const unsubscribeRefresh = messaging().onTokenRefresh(handleTokenRefresh);

    return () => {
      unsubscribeRefresh();
    };
  }, [])

  const showNotification = (notification) => {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body,
    });
  }



  useEffect(() => {
    requestUserPermission();
    notificationListener();
    if(getUser() !==null) getToken();
  },[])


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (    
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor : 'skyblue',
        }}
      >
        
        <Tab.Screen 
          name="Home" 
          // component={HomeScreen} 
          options={{
            title:'Home',
            tabBarIcon:({color, size}) => <Icon name='home' color={color} size={size}/>
        }}
        >{props => (
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
          />
        )}
        </Tab.Screen>
        
        <Tab.Screen 
          name="Calendar" 
          children={(props) => (
            <CalendarScreen
              navigation={navigation}
              setSelectRoomId={setSelectRoomId}
            />
          )}
          options={{
            title:'Calendar',
            tabBarIcon:({color, size}) => <Icon name='calendar-number' color={color} size={size}/>
        }}
        />
        <Tab.Screen 
          name="Alarm" 
          component={AlarmScreen} 
          options={{
            title:'Alarm',
            tabBarIcon:({color, size}) => <Icon name='alarm' color={color} size={size}/>
        }}
        />
          
        <Tab.Screen 
          name="Todo" 
          component={TodoScreen}
          options={{
            title:'Todo',
            tabBarIcon:({color, size}) => <Icon2 name='clipboard-list' color={color} size={size}/>
        }}
        />      
        <Tab.Screen 
          name="Chat" 
          children={(props) => (
            <ChatScreen 
             {...props}
             selectRoomId={selectRoomId}
             setSelectRoomId={setSelectRoomId}
            />
          )}
          options={{
            title:'Chat',
            headerShown:false,
            tabBarIcon:({color, size}) => <Icon name='chatbubbles-sharp' color={color} size={size}/>
        }}
        />
      </Tab.Navigator>
  )
}

export default App;
