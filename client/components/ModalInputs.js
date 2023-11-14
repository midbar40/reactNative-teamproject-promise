import React,{ useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'

import DateTimePicker from 'react-native-modal-datetime-picker'



function ModalInputs({selectedDate, startDate, setStartDate, endDate, setEndDate, itemKey, }){

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
    console.log('pickdate', date)
    setStartPick(date)
    setStartVisible(false)
  }

  //종료 날짜 고르기
  const handleConfirm2 = (date) => {
    console.log('end', endDate)
    setEndPick(date)
    setEndVisible(false)
  }

  //시작 날짜 바꾸기
  useEffect(() => {
    startPick && setStartDate(startPick)
  },[startPick])

  //종료 날짜 바꾸기
  useEffect(() => {
    console.log('useEffect2', endPick)

    endPick && setEndDate(`${endPick.getFullYear()}-${(endPick.getMonth()+1)}-${endPick.getDate()}`)
    console.log('zzzzzz',endDate)
  },[endPick])

  return(
    <View style={styles.block}>
      <View style={styles.horizontalView}>
        <TouchableOpacity style={styles.picker} onPress={pressStart}>
          <Text style={styles.titleText}>시작 날짜 : </Text>
          <Text>{startDate}</Text>
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
          <Text>{endDate}</Text>
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
    marginRight: 15,
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
    marginHorizontal: 30,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgreen',
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 2,
  }
})

export default ModalInputs