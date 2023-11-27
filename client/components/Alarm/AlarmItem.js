import React, { useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import moment from 'moment-timezone'
import { useFocusEffect } from '@react-navigation/native'
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler'

function AlarmItem({ item, onDelete, isFocused }) {
  const swipeableRef = useRef(null)

  // 오른쪽으로 스와이프
  const rightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={[styles.deleteText, styles.font]}>Delete</Text>
      </TouchableOpacity>
    )
  }

  // 리스트 삭제
  const handleDelete = () => {
    // 리스트 삭제 애니메이션
    // fetch('http://192.168.200.13:5300/firebaseLogin/cancel', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: {
    //     id: item.id
    //   }
    // })
    // .catch(error => console.error(error))

    Animated.timing(translateX, {
      toValue: 62, // 리스트를 오른쪽으로 사라지는 거리(화면밖으로)
      duration: 250, // 애니메이션 시간
      useNativeDriver: true, // 애니메이션이 실행이 native면(true), javascript면(false) 
    }).start(() => {
      onDelete(item.id) // 리스트 제거
      translateX.setValue(0) // 추후 리스트 애니메이션 값 재설정
    })

    
    console.log('패치 하고 난후')

  }

  const translateX = new Animated.Value(0)

  // 다른화면 갔다가 왔을때
  useFocusEffect(
    React.useCallback(() => {
      if (swipeableRef.current && !isFocused) {
        swipeableRef.current.close()
      }
    }, [isFocused])
  )

  return (
    <GestureHandlerRootView style={styles.swipe}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={rightActions}
      >
        <Animated.View // Animated.View로 리스트 래핑
          style={[
            styles.alarmItem,
            { transform: [{ translateX }] } // 변환 적용
          ]}
        >
          <Text style={[styles.alarmTime, styles.font]}>
            {moment(item.time).tz('Asia/Seoul').format('hh:mm A')}
          </Text>
          <Text style={[styles.alarmTitle, styles.font]} numberOfLines={1} ellipsizeMode='tail'>
            {item.title}
          </Text>
        </Animated.View>
      </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#42D0B9',
    borderRadius: 10,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  alarmTime: {
    fontSize: 16,    
    // fontWeight: 'bold',
  },
  alarmTitle: {
    fontSize: 16,
    alignItems: 'flex-start',
    width: 170,
    marginLeft: 20,
    paddingLeft: 10,    
    // fontWeight: 'bold'
  },
  swipe: {
    backgroundColor: '#fff',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 44,
    borderRadius: 10,
    right: -16,
  },
  deleteText: {
    color: '#fff',
    // fontWeight: 'bold',
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold'
  },
})

export default AlarmItem