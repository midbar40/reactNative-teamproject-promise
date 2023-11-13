import React,{ useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'


function DropdownItem({title, modalTitle, selectedDate, category, closeDropdown, startDate, setStartDate, endDate, setEndDate}){
  
  //카테고리 클릭
  const onPress = () => {
    console.log('아이템',selectedDate)
    console.log('ahekfxkdl', modalTitle)
    if(modalTitle === '시작날짜'){
      if(title === '년'){
        // console.log(category)
        setStartDate((prev) => ({...prev, year:category}))
      }else if(title === '월'){
        setStartDate((prev) => ({...prev, month:category}))
      }else if(title === '일'){
        setStartDate((prev) => ({...prev, date:category}))
      }
    }else{
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
        <Text style={styles.text}>{category}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // backgroundColor: 'green'
    // height:200,
    elevation:2,
    zIndex:2,
  },
  DropdownItemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 0,
    marginLeft: 5,
    // elevation:2,
  },
  text: {
    backgroundColor: '#fff'
  },
  
})

export default DropdownItem