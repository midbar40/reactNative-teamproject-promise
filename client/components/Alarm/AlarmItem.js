import React from 'react'
import { View, Text, StyleSheet} from 'react-native'
import moment from 'moment-timezone'

function AlarmItem({item}){

  return (    
      <View style={styles.alarmItem}>
        <Text style={styles.alarmTime}>
          {moment(item.time).tz('Asia/Seoul').format('hh:mm A')}
        </Text>
        <Text style={styles.alarmTitle} numberOfLines={1} ellipsizeMode='tail'>
          {item.title}
        </Text>
      </View>    
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
})

export default AlarmItem