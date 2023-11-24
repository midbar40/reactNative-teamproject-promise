import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getUser} from './apis/auth';
import {HomeScreen, CalendarScreen, AlarmScreen, ChatScreen} from './screens';

import Icon from 'react-native-vector-icons/Ionicons.js';
import messaging from '@react-native-firebase/messaging';
import {
  getToken,
  notificationListener,
  requestUserPermission,
} from './apis/firebaseMessage';

const Tab = createBottomTabNavigator();
function App({navigation}) {
  // console.log(route.params.email)

  const [selectRoomId, setSelectRoomId] = useState('');

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    if (getUser() !== null) getToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data.type === 'alarm')
        Alert.alert(
          '알람 도착',
          `\n${remoteMessage.notification.title}\n\n${remoteMessage.notification.body}`,
        );
    });

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#444',
        tabBarInactiveTintColor: '#aaa',
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarActiveTintColor: '#FAA6AA',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}>
        {props => <HomeScreen {...props} navigation={navigation} />}
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
          headerShown: false,
          tabBarActiveTintColor: '#99BFBF',
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar-number" color={color} size={size} />
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
          tabBarActiveTintColor: '#FAA6AA',
          tabBarIcon: ({color, size}) => (
            <Icon name="chatbubbles-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{
          title: 'Alarm',
          headerShown: false,
          tabBarActiveTintColor: '#42D0B9',
          tabBarIcon: ({color, size}) => (
            <Icon name="alarm" color={color} size={size} />
          ),
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
  );
}

export default App;
