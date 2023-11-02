import React,{useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen, CalendarScreen, AlarmScreen, TodoScreen} from './screens';
const Tab = createBottomTabNavigator();


function App({navigation, route}) {
  console.log(route.params.email)

  const [isLogin, setIsLogin] = useState(false);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" options={{headerShown: false}}>
        {props => (
          <HomeScreen
            {...props}
            navigation={navigation}
            loginInfo={route.params.email}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

export default App;
