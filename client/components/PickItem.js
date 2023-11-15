import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

import { updateData } from '../apis/firebaseCalendar'



function PickItem({ title, content, startDay, endDay, id, members, setItemKey, setOpenModal}){

  const [memberList, setmemberList] = useState('')

  const longPress = () => {
    console.log('길게누르기', id)
    setItemKey(id)
    setOpenModal(true)
  }

  useEffect(() => {
    const list = []
    members && members.map(member => {
      list.push(member.name)
    })
    setmemberList(list)
  },[])

  return(
    <Pressable onLongPress={longPress}>
      <View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.item, styles.text]}>{content}</Text>
          <Text style={styles.item}>{memberList ? memberList.join(', ') : ''}</Text>
          <Text style={styles.item}>{startDay}  ~  {endDay}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgreen',
    padding: 10,
    backgroundColor: '#fff'
  },
  horizontalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 4,
    marginLeft: 2,
  },
  text: {
    fontSize: 15,
    marginBottom: 2,
  },
  item: {
    marginLeft: 2,
    fontSize: 14
  }
})

export default PickItem