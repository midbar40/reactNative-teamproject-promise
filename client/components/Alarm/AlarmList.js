import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native'
import moment from 'moment-timezone'
import { removeData } from './apis/firebase'
import AlarmItem from './AlarmItem'

function AlarmList({ alarms, onRemoveAlarm }) {
  alarms.sort((a, b) => moment(a.time).diff(b.time))

  // const onRemoveAlarm = (id) => {
  //   removeData('Alarms', id)
  // }  
  const scrollY = new Animated.Value(0)

  const translateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )

  return (
    <Animated.View style={{ ...styles.container, transform: [{ translateY }] }}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlarmItem item={item} onDelete={onRemoveAlarm} />
        )}
        onScroll={onScroll}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '90%',
  },
})

export default AlarmList