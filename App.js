import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


function App(){
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>리액트 네이티브 준비완료 !</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: 'orange'
  }
})

export default App;