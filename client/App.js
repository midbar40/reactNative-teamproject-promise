import React, { useState, useEffect } from 'react';
import { AppRegistry, View, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, CalendarScreen, AlarmScreen, TodoScreen, ChatScreen } from './screens';
import messaging from '@react-native-firebase/messaging'

import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome6'

const Tab = createBottomTabNavigator();

function App({ navigation, route }) {
  // console.log(route.params.email) 
  const [isLogin, setIsLogin] = useState(false); 
    
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, [])

  useEffect(() => {
    const requestPermission = async () => {
      try {
        await messaging().requestPermission();
        console.log('Permission granted');
      } catch (error) {
        console.error('Permission denied', error);
      }
    };
  
    requestPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh((newToken) => {
      // Save the new token to your backend
      console.log('Token refreshed:', newToken);
    });
  
    return unsubscribe;
  }, [])

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'skyblue',
      }}
    >
      <Tab.Screen
        name="Home"
        // component={HomeScreen} 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name='home' color={color} size={size} />
        }}
      >{props => (
        <HomeScreen
          {...props}
          navigation={navigation}
        />
      )}
      </Tab.Screen>

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Icon name='calendar-number' color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{
          title: 'Alarm',
          tabBarIcon: ({ color, size }) => <Icon name='alarm' color={color} size={size} />
        }}
      />

      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          title: 'Todo',
          tabBarIcon: ({ color, size }) => <Icon2 name='clipboard-list' color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <Icon name='chatbubbles-sharp' color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  )
}

export default App;
