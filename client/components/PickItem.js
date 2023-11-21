import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

import { updateData } from '../apis/firebaseCalendar'


function PickItem({ title, content, startDay, endDay, id, members, lastModifedUser, setItemKey, setOpenModal, showSchedule }){

  const [memberList, setmemberList] = useState('')

  const longPress = () => {
    console.log('길게누르기', id)
    setItemKey(id)
    setOpenModal(true)
  }

  useEffect(() => {
    const list = []
    members && members.map((member, id) => {
      // console.log('memberrrrr', member)
      list.push(member.name)
    })
    setmemberList(list)
  },[showSchedule])

  return(
    <Pressable onLongPress={longPress}>
      <View>
        <View style={styles.content}>
          <Text style={[styles.title, styles.font]}>{title}</Text>
          <Text style={[styles.item, styles.text, styles.font]}>{content}</Text>
          <Text style={[styles.item, styles.font]}>{memberList ? memberList.join(', ') : ''}</Text>
          <Text style={[styles.item, styles.font]}>{startDay}  ~  {endDay}  (수정 : {lastModifedUser})</Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    borderBottomWidth: 1,
    borderBottomColor: '#BDEDD2',
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
    // fontWeight: 'bold',
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
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold'
  },
  fontL:{
    fontFamily: 'IM_Hyemin-Regular',
  }
})

export default PickItem