import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native'
import moment from 'moment-timezone'
import AddAlarm from './AddAlarm'
import AlarmList from './AlarmList'
import Icon from 'react-native-vector-icons/Ionicons'
import { addData, getCollection, getCurrentTime, removeData } from './apis/firebase'

function Time(){
  const [currentTime, setCurrentTime] = useState(moment().tz('Asia/Seoul'))
  const [alarmTimes, setAlarmTimes] = useState([])   
  const [addAlarmModal, setAddAlarmModal] = useState(false)

  // 시간을 AM/PM으로 나누어 보여주기 
  const getFormattedTime = (time) => {    
    const formattedTime = time.format('hh:mm A')
    return formattedTime
  }

  // 알람 추가
  const addAlarm = (time, title) => { 
    const alarmTime = moment(currentTime).add(time, 'minutes') 
    const alarmId = Math.random().toString(36).substring(7)
    const alarm = {
      id: alarmId,
      time: alarmTime.toISOString(),
      title,
      createdAt: getCurrentTime(),
    }
    setAlarmTimes([...alarmTimes, alarm])
    setAddAlarmModal(false)
    addData('Alarms', alarm)
  }
   //알람 삭제
  const removeAlarm = (id) => {
    const updatedAlarms = alarmTimes.filter((alarm) => alarm.id !== id)
    setAlarmTimes(updatedAlarms)
    removeData('Alarms', id)
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

  useEffect(() => {
    const fetchAlarms = getCollection(
      'Alarms',
      (querySnapshot) => {
        const alarms = []
        querySnapshot.forEach((doc) => {
          const alarmData = doc.data()
          alarms.push(alarmData)
        })
        setAlarmTimes(alarms)
      },
      (error) => {
        console.error('알람 조회중 오류: ', error)
      }
    )
    return () => {
      fetchAlarms()
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
          <AlarmList alarms={alarmTimes} onRemoveAlarm={removeAlarm}/>        
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddAlarmModal(true)}
      >
        <Text style={styles.addText}>
        <Icon name='add' size={40}/>
        </Text>
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
    backgroundColor: '#98c8ffff',
    borderRadius: 20,     
  },
  dayText: {
    fontSize: 50,
    marginTop: 10,
    marginBottom: 5,   
    fontWeight: 'bold',
    color: '#fff'
  },
  timeText: {
    fontSize: 40,
    marginBottom: 15,
    fontWeight: 'bold',  
    color: '#fff'
  },  
  alarmsContainer: {
    alignItems: 'center',
    flex: 1,
  },
  alarmsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },  
  addButton: {
    backgroundColor: '#a8c8ffff',
    width: 50, height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30, right: 30,
  },
  addText: {    
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  }
})

export default Time