import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Button, Pressable } from 'react-native'

import { getFullCalendar } from '../utils/time'

function CalendarMade(){

  const today = getFullCalendar(new Date())
  const week = ['일', '월', '화', '수', '목', '금', '토']

  

}


export default CalendarMade