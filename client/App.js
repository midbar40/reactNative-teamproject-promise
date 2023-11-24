import React, {useEffect, useState} from 'react';
import { Alert } from 'react-native';
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
  setAppState,
  appState,
  isGoogleLogin,
  setIsGoogleLogin
}) {
  // console.log(route.params.email)

  const [isLogin, setIsLogin] = useState(false);
  const [selectRoomId, setSelectRoomId] = useState('');

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    if (getUser() !== null) getToken();
  }, [])


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if(remoteMessage.data.type === 'alarm')
      Alert.alert('알람 도착', `\n${remoteMessage.notification.title}\n\n${remoteMessage.notification.body}`);
    });

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#444',
        tabBarInactiveTintColor: '#aaa',
        tabBarHideOnKeyboard: true,
      }}
    >

      <Tab.Screen
        name="Home"
        // component={HomeScreen} 
        options={{
          title: 'Home',
          headerShown: false,
          tabBarActiveTintColor: '#FAA6AA',
          tabBarIcon: ({ color, size }) => <Icon name='home' color={color} size={size} />
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
          setAppState={setAppState}
          appState={appState}
          isGoogleLogin={isGoogleLogin}
          setIsGoogleLogin={setIsGoogleLogin}
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
          title: 'Calendar',
          headerShown: false,
          tabBarActiveTintColor: '#99BFBF',
          tabBarIcon: ({ color, size }) => <Icon name='calendar-number' color={color} size={size} />
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
          title: 'Chat',
          headerShown: false,
          tabBarActiveTintColor: '#FAA6AA',
          tabBarIcon: ({ color, size }) => <Icon name='chatbubbles-sharp' color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{
          title: 'Alarm',
          headerShown: false,
          tabBarActiveTintColor: '#42D0B9',
          tabBarIcon: ({ color, size }) => <Icon name='alarm' color={color} size={size} />
        }}
      />

      {/* <Tab.Screen 
          name="Todo" 
          component={TodoScreen}
          options={{
            title:'Todo',
            tabBarIcon:({color, size}) => <Icon2 name='clipboard-list' color={color} size={size}/>
        }}
        />       */}
    </Tab.Navigator>
  )
}

export default App;
