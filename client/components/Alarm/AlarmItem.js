import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import moment from 'moment-timezone'
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler'

function AlarmItem({ item, onDelete }) {
  const renderRightActions = () => {
    return (
      <TouchableOpacity style={styles.delete} onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    )
  }

  const handleDelete = () => {
    onDelete(item.id)
  }

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions} onSwipeableRightOpen={handleDelete}>
      <View style={styles.alarmItem}>
        <Text style={styles.alarmTime}>
          {moment(item.time).tz('Asia/Seoul').format('hh:mm A')}
        </Text>
        <Text style={styles.alarmTitle} numberOfLines={1} ellipsizeMode='tail'>
          {item.title}
        </Text>
      </View>
    </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#98c8ffff',
    borderRadius: 10,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
  },
  alarmTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarmTitle: {
    fontSize: 16,
    alignItems: 'flex-start',
    width: 170,
    fontWeight: 'bold'
  },
  delete: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
})

export default AlarmItem