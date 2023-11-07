import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import moment from 'moment-timezone'
import { removeData } from './apis/firebase'
import AlarmItem from './AlarmItem'

function AlarmList({ alarms, onRemoveAlarm }) {
  alarms.sort((a, b) => moment(a.time).diff(b.time))

  // const onRemoveAlarm = (id) => {
  //   removeData('Alarms', id)
  // }  

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <AlarmItem item={item} onDelete={onRemoveAlarm} />
          </TouchableOpacity>
        )}
      />
    </View>
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