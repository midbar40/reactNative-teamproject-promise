import React,{ useState } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'

import DateTimePicker from 'react-native-modal-datetime-picker'

import DropdownList from './DropdownList'



function ModalInputs({selectedDate, modalTitle, startDate, setStartDate, endDate, setEndDate, }){

  const [dropYearOpen, setDropYearOpen] = useState(false) //드롭다운 오픈(년)
  const [dropMonthOpen, setDropMonthOpen] = useState(false) //드롭다운 오픈(월)
  const [dropDateOpen, setDropDateOpen] = useState(false) //드롭다운 오픈(일)

  // console.log('시작', startDate)
  // console.log('끝', endDate)

  //날짜 가져오기
  const N = 10
  const pickDay = new Date(selectedDate)
  const pickYear = pickDay.getFullYear()
  const pickMonth = pickDay.getMonth() + 1
  const pickDate = pickDay.getDate()
  
  console.log(pickYear, '-', pickMonth, '-', pickDate)

  //드롭다운 범위 설정(년,월,일)
  const offset = pickYear
  const yearsRange = Array(2*N).fill(0).map((_, id) => `${id+offset}년`)
  const monthRangeTest = Array(12).fill(0).map((_, id) => `${id+1}월`)
  //1~9월 01~09월로 변환
  const monthRange = monthRangeTest.map(month => {
    if(month.length > 2){
      return month
    }else{
      return `0${month}`
    }
  })
  const dateRangeTest = Array(31).fill(0).map((_, id) => `${id+1}일`)
  //1~9일 01~09일로 변환
  const dateRange = dateRangeTest.map(date => {
    if(date.length > 2){
      return date
    }else{
      return `0${date}`
    }
  })
  // console.log(yearsRange, monthRange, dateRange)

  return(
    <View style={styles.block}>
      <View style={styles.horizontalAlign}>
        <View style={[styles.dropDowns]}>
          <Text style={styles.titleText}>{modalTitle}</Text>
          <View style={[styles.dropDownlists]}>
            <DropdownList title='년' categories={yearsRange} dropYearOpen={dropYearOpen} setDropYearOpen={setDropYearOpen} selectedDate={selectedDate} startDate={startDate} setStartDate={setStartDate} modalTitle={modalTitle} endDate={endDate} setEndDate={setEndDate}/>
            <DropdownList title='월' categories={monthRange} dropMonthOpen={dropMonthOpen} setDropMonthOpen={setDropMonthOpen} selectedDate={selectedDate} startDate={startDate} setStartDate={setStartDate} modalTitle={modalTitle} endDate={endDate} setEndDate={setEndDate}/>
            <DropdownList title='일' categories={dateRange} dropDateOpen={dropDateOpen} setDropDateOpen={setDropDateOpen} selectedDate={selectedDate} startDate={startDate} setStartDate={setStartDate} modalTitle={modalTitle} endDate={endDate} setEndDate={setEndDate}/>
          </View>
        </View>
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
})

export default ModalInputs