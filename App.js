import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ChatScreen from './screens/ChatScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function App(){
  return (
    <NavigationContainer>
      <Tab.Navigator>
      {/* <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Alarm" component={AlarmScreen} />
      <Tab.Screen name="Todo" component={TodoScreen} />       */}
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App;