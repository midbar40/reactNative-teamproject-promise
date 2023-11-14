import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'

import DateTimePicker from 'react-native-modal-datetime-picker'

function ModalTextInputs({title, scheduleTitle, setScheduleTitle, scheduleContent, setScheduleContent, itemKey}){
 
  console.log('itemkey',itemKey)
  const handleChange = (text) => {
    if(title === '할일 제목'){
      setScheduleTitle(text)
    // }else if(title === '할일 내용'){
    }else{
      setScheduleContent(text)
    }

  }
  

  if(itemKey === ''){
    return(
      <>
        <View style={styles.horizontalView}>
          <Text style={styles.title}>{title} : </Text>
            <TextInput
              autoCorrect={false}
              style={styles.textInput}
              selectionColor={'#E7BFFF'}
              onChangeText={handleChange}
              blurOnSubmit={false}
            />
        </View>
        <View style={styles.horizontalView}>
          <Text style={styles.title}>할일 내용 : </Text>
            <TextInput
              autoCorrect={false}
              style={styles.textInput}
              selectionColor={'#E7BFFF'}
              onChangeText={handleChange}
              blurOnSubmit={false}
            />
        </View>
      </>
    )
  }else{
    return(
      <>
        <View style={styles.horizontalView}>
          <Text style={styles.title}>{title} : </Text>
            <TextInput
              // placeholder={'할일ㅇ'}
              autoCorrect={false}
              style={styles.textInput}
              selectionColor={'#E7BFFF'}
              onChangeText={handleChange}
              blurOnSubmit={false}
              defaultValue={scheduleTitle}
            />
        </View>
        <View style={styles.horizontalView}>
          <Text style={styles.title}>할일내용 : </Text>
            <TextInput
              // placeholder={'할일ㅇ'}
              autoCorrect={false}
              style={styles.textInput}
              selectionColor={'#E7BFFF'}
              onChangeText={handleChange}
              blurOnSubmit={false}
              defaultValue={scheduleContent}
            />
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  horizontalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    borderBottomWidth:1,
    borderBottomColor: 'lightgreen',
    paddingLeft: 10,
    paddingBottom: 0,
    marginBottom: 10,
    width: 230,
  },
  dateInput: {
    borderBottomWidth:1,
    borderBottomColor: 'lightgreen',
    paddingLeft: 10,
    paddingBottom: 0,
    marginBottom: 10,
    width: 50,
  },
  dateInput2:{
    width: 30,
  },
  title:{
    marginRight: 15
  },
  text: {
    marginLeft: 7,
    marginRight: 20
  }

})

export default ModalTextInputs