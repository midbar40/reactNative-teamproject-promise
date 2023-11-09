import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'

function ModalTextInputs({title, scheduleTitle, setScheduleTitle, scheduleContent, setScheduleContent, itemKey}){
 
  console.log('itemkey',itemKey)
  const handleChange = (text) => {
    if(title === '할일 제목'){
      setScheduleTitle(text)
    }else if(title === '할일 내용'){
      setScheduleContent(text)
    }

  }
  

  if(itemKey === ''){
    return(
      <View style={styles.horizontalView}>
        <Text style={styles.title}>{title} : </Text>
          <TextInput
            // placeholder={'할일ㅇ'}
            autoCorrect={false}
            style={styles.textInput}
            selectionColor={'#E7BFFF'}
            onChangeText={handleChange}
            blurOnSubmit={false}
          />
      </View>
    )
  }else{
    return(
      <View style={styles.horizontalView}>
        <Text style={styles.title}>{title} : </Text>
        {title === '할일 제목' ? 
          <TextInput
            // placeholder={'할일ㅇ'}
            autoCorrect={false}
            style={styles.textInput}
            selectionColor={'#E7BFFF'}
            onChangeText={handleChange}
            blurOnSubmit={false}
            defaultValue={scheduleTitle}
          />
          :
          <TextInput
            // placeholder={'할일ㅇ'}
            autoCorrect={false}
            style={styles.textInput}
            selectionColor={'#E7BFFF'}
            onChangeText={handleChange}
            blurOnSubmit={false}
            defaultValue={scheduleContent}
          />
        }
      </View>
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
  title:{
    marginRight: 15
  }

})

export default ModalTextInputs