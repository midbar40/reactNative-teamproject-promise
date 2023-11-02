import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import AlarmScreen from './screens/AlarmScreen';
import TodoScreen from './screens/TodoScreen';


const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Alarm" component={AlarmScreen} />
        <Tab.Screen name="Todo" component={TodoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App;