import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

function AlarmList({ alarms }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm List</Text>
      <FlatList
        data={alarms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.alarmItem}>
            <Text style={styles.alarmTime}>{item.time.format('HH:mm A')}</Text>
            <Text style={styles.alarmTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  alarmTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarmTitle: {
    fontSize: 16,
  },
})

export default AlarmList