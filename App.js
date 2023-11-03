import React, {useState} from 'react';
// import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import ChatScreen from './screens/ChatScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen, CalendarScreen, AlarmScreen, TodoScreen} from './screens';
import {getUser} from './apis/auth';
const Tab = createBottomTabNavigator();

function App({navigation}) {
  console.log('App화면')
  console.log(getUser(), 'App'); // 로그인한 유저의 정보를 가져옴 (이메일, uid)

  const [isLogin, setIsLogin] = useState(false);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" options={{headerShown: false}}>
        {props => (
          <HomeScreen
            {...props}
            navigation={navigation}
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
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

export default App;
