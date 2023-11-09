import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, CalendarScreen, AlarmScreen, TodoScreen, ChatScreen } from './screens';
import messaging from '@react-native-firebase/messaging'
import { setFcmToken } from 'services/fcm'

import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome6'

const Tab = createBottomTabNavigator();

function App({ navigation, route }) {
  // console.log(route.params.email)
  const [pushToken, setPushToken] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const [isLogin, setIsLogin] = useState(false); 
  const foregroundListener = useCallback(() => {
    messaging().onMessage(async message => {
      console.log(message)
    })
  }, [])

  useEffect(() => {
    foregroundListener()
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
