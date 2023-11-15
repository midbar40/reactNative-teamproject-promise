import React, {useEffect, useState} from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {HomeScreen, CalendarScreen, AlarmScreen, TodoScreen, ChatScreen} from './screens';

import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome6'

import messaging from '@react-native-firebase/messaging';
import { getToken, notificationListener, requestUserPermission} from './apis/firebaseMessage';

const Tab = createBottomTabNavigator();

function App({navigation, route, isSnsLogin, setIsSnsLogin, isKakaoLogin, setIsKakaoLogin, isNaverLogin, setIsNaverLogin, userInfo, setUserInfo}) {
  // console.log(route.params.email)

  const [selectRoomId, setSelectRoomId] = useState('');

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    getToken();
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
