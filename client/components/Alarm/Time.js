import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import moment from 'moment-timezone'
import AddAlarm from './AddAlarm'
import AlarmList from './AlarmList'
import Icon from 'react-native-vector-icons/Ionicons'
import { addData, getCollection, getCurrentTime, removeData, updateDate } from './apis/firebase'
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'
import { getUser } from '../../apis/auth'

function Time({ isFocused, fcmToken }) {
  const [currentTime, setCurrentTime] = useState(moment().tz('Asia/Seoul'))
  const [alarmTimes, setAlarmTimes] = useState([])
  const [addAlarmModal, setAddAlarmModal] = useState(false)
  const [openSwipeableItem, setOpenSwipeableItem] = useState(null)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true)
      }
    )

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false)
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // 시간을 AM/PM으로 나누어 보여주기 
  const getFormattedTime = (time) => {
    const formattedTime = time.format('hh:mm A')
    return formattedTime
  }

  const signIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password)
      const user = userCredential.user
      console.log('사용자 로그인:', user.uid)
    } catch (error) {
      console.error('인증오류:', error)
    }
  }

  // 알람 추가
  const addAlarm = async (time, title,) => {
    const currentTimeInKorea = moment().tz('Asia/Seoul')
    const timeDifference = moment.duration(time, 'minutes')
    const alarmTime = currentTimeInKorea.clone().add(timeDifference)
    const alarmId = Math.random().toString(36).substring(7)
    console.log('al id: ',alarmId)
    const deviceToken = fcmToken || (await messaging().getToken())
    const userUid = auth().currentUser.uid
    const alarm = {
      id: alarmId,
      time: alarmTime.format(),
      title,
      createdAt: getCurrentTime(),
      deviceToken,
      userUid,
    }
    setAlarmTimes([...alarmTimes, alarm])
    setAddAlarmModal(false)
    addData('Alarms', alarm)
    fetch('https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/firebaseLogin/msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time: alarmTime,
        title: title,
        uid: getUser().uid,
        id: alarmId,        
      })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
  }
  //알람 삭제
  const removeAlarm = (id) => {
    const currentUserUid = auth().currentUser.uid
    const updatedAlarms = alarmTimes.filter((alarm) => alarm.id !== id && alarm.userUid === currentUserUid)
    setAlarmTimes(updatedAlarms)
    removeData('Alarms', id)
    fetch('https://port-0-rnproject-server-5mk12alpawtk1g.sel5.cloudtype.app/firebaseLogin/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
      .catch(error => console.error(error))
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

  // 알람 리스트 조회
  useEffect(() => {
    const fetchAlarms = getCollection(
      'Alarms',
      (querySnapshot) => {
        const alarms = []
        const currentUserUid = auth().currentUser.uid
        querySnapshot.forEach((doc) => {
          const alarmData = doc.data()
          if (alarmData.userUid === currentUserUid) {
            alarms.push(alarmData)
            // alarmData.time = alarmData.time.toDate()
          }
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

  // 다시 터치했을때 스와이프 닫기
  const closeSwipeableItem = () => {
    if (openSwipeableItem) {
      openSwipeableItem.close()
      setOpenSwipeableItem(null)
    }
  }

  const checkAndTriggerAlarms = () => {
    alarmTimes.forEach((alarm) => {
      const alarmTime = moment(alarm.time);
      if (currentTime.isSame(alarmTime, 'second')) {
        console.log('Matching alarm! Trigger notification:', alarm);
      }
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().tz('Asia/Seoul'));
      checkAndTriggerAlarms();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentTime, alarmTimes]);

  return (
    <View style={styles.container}>
      <View style={styles.dayContainer}>
        <Text style={[styles.dayText, styles.font]}>
          {currentTime.format('YYYY. MM. DD')}
        </Text>
        <Text style={[styles.timeText, styles.font]}>
          {getFormattedTime(currentTime)}
        </Text>
      </View>

      <View
        style={styles.alarmsContainer}
        onTouchStart={closeSwipeableItem}
      >
        <Text style={[styles.alarmsText, styles.font]}>Alarms : </Text>
        <AlarmList
          alarms={alarmTimes}
          onRemoveAlarm={removeAlarm}
          onOpen={(swipeable) => setOpenSwipeableItem(swipeable)}
          isFocused={isFocused}
        />
      </View>
      {!isKeyboardOpen && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddAlarmModal(true)}
        >
          <Text style={styles.addText}>
            <Icon name='add' size={40} />
          </Text>
        </TouchableOpacity>
      )}
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
    marginTop: 70,
    width: '90%',
    backgroundColor: '#42D0B9',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 50,
    marginTop: 10,
    marginBottom: 5,
    // fontWeight: 'bold',
    color: '#fff'
  },
  timeText: {
    fontSize: 40,
    marginBottom: 15,
    // fontWeight: 'bold',
    color: '#fff'
  },
  alarmsContainer: {
    alignItems: 'center',
    flex: 1,
  },
  alarmsText: {
    fontSize: 20,
    // fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#42D0B9',
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
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold'
  },
})

export default Time