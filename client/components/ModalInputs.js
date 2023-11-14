import React,{ useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert} from 'react-native'

import DateTimePicker from 'react-native-modal-datetime-picker'



function ModalInputs({selectedDate, startDate, setStartDate, endDate, setEndDate, isSameDate, }){

  const [startVisible, setStartVisible] = useState(false)
  const [endVisible, setEndVisible] = useState(false)
  const [startPick, setStartPick] = useState('')
  const [endPick, setEndPick] = useState('')


  const pickDay = new Date(selectedDate)

  const hideDatePicker = () => {
    setDatePickerVisible(false)
  }
  
  const pressStart = () => {
    console.log('start',startDate)
    setStartVisible(true)
  }
  
  const pressEnd = () => {
    console.log('end', endDate)
    setEndVisible(true)
  }

  //시작 날짜 고르기
  const handleConfirm = (date) => {
    //오늘보다 과거날짜 선택 X
    if(new Date() < date || isSameDate(date, new Date())){
      setStartPick(date)
      setStartVisible(false)
    }else{
      Alert.alert('경고!', '지난 날짜를 선택하실 수 없습니다.')
      setStartVisible(false)
    }
  }

  //종료 날짜 고르기
  const handleConfirm2 = (date) => {
    //시작 날짜보다 과거 선택 X
    if(new Date(startDate) < date || isSameDate(date, new Date(startDate))){
      setEndPick(date)
      setEndVisible(false)
    }else{
      Alert.alert('경고!', '시작날짜보다 과거의 날짜를 선택하실 수 없습니다.')
      setEndVisible(false)
    }
  }

  //시작 날짜 바꾸기
  useEffect(() => {
    startPick && setStartDate(`${startPick.getFullYear()}-${(startPick.getMonth()+1)}-${startPick.getDate()}`)
  },[startPick])

  //종료 날짜 바꾸기
  useEffect(() => {
    endPick && setEndDate(`${endPick.getFullYear()}-${(endPick.getMonth()+1)}-${endPick.getDate()}`)
  },[endPick])

  return(
    <View style={styles.block}>
      <View style={styles.horizontalView}>
        <TouchableOpacity style={styles.picker} onPress={pressStart}>
          <Text style={styles.titleText}>시작 날짜 : </Text>
          <Text style={styles.titleText}>{startDate}</Text>
          <DateTimePicker
            isVisible={startVisible}
            mode='date'
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={pickDay}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.picker} onPress={pressEnd}>
          <Text style={styles.titleText}>종료 날짜 : </Text>
          <Text style={styles.titleText}>{endDate}</Text>
          <DateTimePicker
            isVisible={endVisible}
            mode='date'
            onConfirm={handleConfirm2}
            onCancel={hideDatePicker}
            date={new Date(endDate)}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // block: {
  //   flex: 1,
  //   width: 300,
  //   height: 500
  // },
  dropDowns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontWeight: 'bold',
    // fontStyle: 'italic',
  },
  dropDownlists: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  horizontalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  picker: {
    margin: 20,
    marginHorizontal: 22,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgreen',
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 2,
  }
})

export default ModalInputs