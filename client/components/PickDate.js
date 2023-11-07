import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, Pressable, ScrollView} from 'react-native'

function PickDate({selectedDate, setSelectedDate, showSchedule, }){

  const onTouchStart = () => {

    
  }
  console.log(showSchedule)
  return(
    selectedDate &&
    <ScrollView style={styles.block} onTouchStart={onTouchStart}>
      {showSchedule.map((show,id) => {
        return(
          <View style={styles.content} key={id}>
            <Text>제목 : {show.title}</Text>
            <Text>내용 : {show.content}</Text>
            {/* <Text>멤버 : {show.members}</Text> */}
            <Text>{show.startDay}  ~  {show.endDay}</Text>
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
  content: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgreen',
    padding: 10,
  }
})


export default PickDate