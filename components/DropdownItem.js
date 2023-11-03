import React,{ useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'


function DropdownItem({title, modalTitle, selectedDate, category, closeDropdown, setStartDate, setEndDate}){
  
  //카테고리 클릭
  const onPress = () => {
    console.log('아이템',selectedDate)
    
    if(modalTitle === '시작날짜'){
      if(title === '년'){
        setStartDate((prev) => ({...prev, year:category}))
      }else if(title === '월'){
        setStartDate((prev) => ({...prev, month:category}))
      }else if(title === '일'){
        setStartDate((prev) => ({...prev, date:category}))
      }
    }else if(modalTitle === '종료날짜'){
      if(title === '년'){
        setEndDate((prev) => ({...prev, year:category}))
      }else if(title === '월'){
        setEndDate((prev) => ({...prev, month:category}))
      }else if(title === '일'){
        setEndDate((prev) => ({...prev, date:category}))
      }
    }
    closeDropdown()
  }
  return(
    <TouchableOpacity onPress={onPress} style={styles.list}>
      <View style={styles.DropdownItemContainer}>
        <Text>{category}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  list: {
    // position: 'absolute',
    // top: 0,
  },
  DropdownItemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 0,
    alignItems: 'flex-start'
  }
})

export default DropdownItem