import React, {useState} from 'react';
// import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen, CalendarScreen, AlarmScreen, TodoScreen} from './screens';
import {getUser} from './apis/auth';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome6'

import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import AlarmScreen from './screens/AlarmScreen';
import TodoScreen from './screens/TodoScreen';
import ChatScreen from './screens/ChatScreen';


const Tab = createBottomTabNavigator();

function App({navigation}) {
  console.log(getUser().email); // 로그인한 유저의 정보를 가져옴 (이메일, uid)

  const [isLogin, setIsLogin] = useState(false);
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title:'Home',
            tabBarIcon:({color, size}) => <Icon name='home' color={color} size={size}/>
        }}
        />
        {props => (
          <HomeScreen
            {...props}
            navigation={navigation}
          />
        )}
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen}
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
        <Tab.Screen name="Chat" component={ChatScreen} />      
      </Tab.Navigator>
    </NavigationContainer>

  );
}

export default App;



