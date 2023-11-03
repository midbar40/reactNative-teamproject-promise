import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, Pressable} from 'react-native'

function PickDate({selectedDate, setSelectedDate, }){

  const onTouchStart = () => {

    //캘린더 밖 터치했을때 클릭되어있던 날짜 초기화
    setSelectedDate('')
    console.log('빈칸:',selectedDate)
  }

  return(
    <View style={styles.block} onTouchStart={onTouchStart}>
      <Text>{selectedDate}</Text>
      <Text>테스트</Text>
    </View>
  )

}

const styles = StyleSheet.create({
  block:{
    flex: 1,
    backgroundColor: '#fff'
  }
})


export default PickDate