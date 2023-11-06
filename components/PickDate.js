import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, Pressable, ScrollView} from 'react-native'

function PickDate({selectedDate, setSelectedDate, showSchedule, }){

  const onTouchStart = () => {

    
  }

  console.log('쇼',showSchedule.length)
  return(
    <ScrollView style={styles.block} onTouchStart={onTouchStart}>
      {showSchedule.map(show => {
        return(
          <View style={styles.content}>
            <Text>제목 :{show.title}</Text>
            <Text>내용 :{show.content}</Text>
            <Text>끝나는 날짜 :{show.endDay}</Text>
          </View>  
        )
      })
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  block:{
    flex: 1,
    backgroundColor: '#fff'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    borderBottomWidth: 1,
  },
  content: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgreen',
    padding: 10,
  }
})


export default PickDate