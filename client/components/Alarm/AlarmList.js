import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, } from 'react-native'
import moment from 'moment-timezone'
import { removeData } from './apis/firebase'
import AlarmItem from './AlarmItem'

function AlarmList({ alarms, onRemoveAlarm }){
  //알람 빠른시간순으로 정렬
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
          <AlarmItem item={item} onDelete={onRemoveAlarm} />
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