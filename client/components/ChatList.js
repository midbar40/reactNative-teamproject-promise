import React from 'react';
import { View, Text } from 'react-native';

function ChatList({ message }){
  return (
    <View>
      <Text>{message}</Text>
    </View>
  )
}

export default ChatList;