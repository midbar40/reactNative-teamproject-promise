import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import moment from 'moment-timezone'
import AddAlarm from './AddAlarm'
import AlarmList from './AlarmList'

function Time(){
  const [currentTime, setCurrentTime] = useState(moment().tz('Asia/Seoul'))
  const [alarmTimes, setAlarmTimes] = useState([])   
  const [addAlarmModal, setAddAlarmModal] = useState(false)

  // 시간을 AM/PM으로 나누어 보여주기 
  const getFormattedTime = (time) => {
    const hours = time.hours()
    const minutes = time.minutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  // 알람 추가
  const addAlarm = (time, title) => {    
    const alarm = {
      time: moment(currentTime).add(time, 'minutes'),
      title,
    }
    setAlarmTimes([...alarmTimes, alarm])
    setAddAlarmModal(false)
  }
  
  // 실시간 한국시간으로 보여주기
  useEffect(() => {    
    const intervalId = setInterval(() => {
      setCurrentTime(moment().tz('Asia/Seoul'))
    }, 1000)

    return () => {      
      clearInterval(intervalId)
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>
          {currentTime.format('YYYY. MM. DD')}
        </Text>
        <Text style={styles.timeText}>
          {getFormattedTime(currentTime)}
        </Text>
      </View>

      <View style={styles.alarmsContainer}>
        <Text style={styles.alarmsText}>Alarms : </Text>
        <AlarmList alarms={alarmTimes} />        
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddAlarmModal(true)}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
      <AddAlarm
        visible={addAlarmModal}
        onClose={() => setAddAlarmModal(false)}
        onAddAlarm={addAlarm}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',    
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, 
    width: '90%',
    backgroundColor: '#dddd',
    borderRadius: 20,     
  },
  dayText: {
    fontSize: 50,
    marginTop: 10,
    marginBottom: 5,   
    fontWeight: 'bold'
  },
  timeText: {
    fontSize: 40,
    marginBottom: 15,
    fontWeight: 'bold'    
  },  
  alarmsContainer: {
    alignItems: 'center',
  },
  alarmsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#a8c8ffff',
    width: 40, height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30, right: 30,
  },
  addText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  }
})

export default Time