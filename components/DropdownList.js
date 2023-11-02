import React,{ useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

import DropdownItem from './DropdownItem'

import AntIcon from 'react-native-vector-icons/AntDesign'

const caretdownComponent = (props) => <AntIcon name='caretdown' {...props} size={15}/>
const caretupComponent = (props) => <AntIcon name='caretup' {...props} size={15}/>


function DropdownList({title, modalTitle, categories, selectedDate,  dropYearOpen, setDropYearOpen, dropMonthOpen, setDropMonthOpen, dropDateOpen, setDropDateOpen, startDate, setStartDate, endDate, setEndDate}){
  
  //드롭다운 닫기
  const closeDropdown = () => {
    dropYearOpen && setDropYearOpen(false)
    dropMonthOpen && setDropMonthOpen(false)
    dropDateOpen && setDropDateOpen(false)
  }
  
  //드롭다운 클릭
  const onPress = () => {
    console.log(title)
    if(title === '년'){
      setDropYearOpen(!dropYearOpen)
    }else if(title === '월'){
      setDropMonthOpen(!dropMonthOpen)
    }else if(title === '일'){
      setDropDateOpen(!dropDateOpen)
    }
  }

  return(
    <TouchableOpacity style={[styles.horizontalAlign, (dropYearOpen || dropMonthOpen || dropDateOpen) && {height:300} ]} onPress={onPress}>
      {dropYearOpen || dropMonthOpen || dropDateOpen ? caretupComponent() : caretdownComponent()}
      {dropYearOpen ?
       <FlatList
        data={categories}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <DropdownItem
            category={item}
            closeDropdown={closeDropdown}
            selectedDate={selectedDate}
            setStartDate={setStartDate} setEndDate={setEndDate}
            title={title} modalTitle={modalTitle}
          />
        )}
      />
      :
      modalTitle === '시작날짜' ? 
      title === '년' &&
      <View>
        <Text>{startDate.year ? startDate.year : `${selectedDate.slice(0,4)}년`}</Text>
      </View>
      :
      title === '년' &&
      <View>
        <Text>{endDate.year ? endDate.year : `${selectedDate.slice(0,4)}년`}</Text>
      </View>
    }
      {dropMonthOpen ?
       <FlatList
        data={categories}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <DropdownItem
            category={item}
            closeDropdown={closeDropdown}
            selectedDate={selectedDate}
            setStartDate={setStartDate} setEndDate={setEndDate}
            title={title} modalTitle={modalTitle}
          />
        )}
      />
      :
      modalTitle === '시작날짜' ? 
      title === '월' &&
      <View>
        <Text>{startDate.month ? startDate.month : `${selectedDate.slice(5,7)}월`}</Text>
      </View>
      :
      title === '월' &&
      <View>
        <Text>{endDate.month ? endDate.month : `${selectedDate.slice(5,7)}월`}</Text>
      </View>

    }
      {dropDateOpen ?
       <FlatList
        data={categories}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <DropdownItem
            category={item}
            closeDropdown={closeDropdown}
            selectedDate={selectedDate}
            setStartDate={setStartDate} setEndDate={setEndDate}
            title={title} modalTitle={modalTitle}
          />
        )}
      />
      :
      modalTitle === '시작날짜' ? 
      title === '일' &&
      <View>
        <Text>{startDate.date ? startDate.date : `${selectedDate.slice(8,10)}일`}</Text>
      </View>
      :
      title === '일' &&
      <View>
        <Text>{endDate.date ? endDate.date : `${selectedDate.slice(8,10)}일`}</Text>
      </View>

    }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  horizontalAlign: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 10,
    marginRight:10,
  }
})

export default DropdownList