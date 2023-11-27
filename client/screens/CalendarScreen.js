import React,{ useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Pressable, Modal, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth'
import AntIcon from 'react-native-vector-icons/AntDesign'

import PickDate from '../components/PickDate';
import ModalInputs from '../components/ModalInputs';
import ModalTextInputs from '../components/ModalTextInputs'
import PickColor from '../components/PickColor';
import AddMembers from '../components/AddMembers'

import { addSchedule, getSchedules, getOneSchedule, updateOneSchedule, getThisSchedulesChatRoom, updateChatRoomTitle, sendNotification } from '../apis/firebaseCalendar'
import { getCurrentTime } from '../apis/firebase';


const auth = getAuth()

function CalendarScreen({ navigation, setSelectRoomId }) {

  const [selectedDate, setSelectedDate] = useState('') //선택한 날짜 담기
  const [openModal, setOpenModal] = useState(false) //모달창 열기
  const [startDate, setStartDate] = useState('') //시작날짜
  const [endDate, setEndDate] = useState('') //종료날짜
  const [scheduleTitle, setScheduleTitle] = useState('') //할일 제목
  const [scheduleContent, setScheduleContent] = useState('') //할일 내용
  const [user, setUser] = useState('') //현재 로그인한 유저 uid저장용
  const [myInfo, setMyInfo] = useState('') //현재 로그인한 유저 정보 저장용
  const [loadSchedule, setLoadSchedule] = useState([]) //불러온 스케쥴 담기
  const [pickSchedule, setPickSchedule] = useState(false) //수정한 하나의 스케쥴 상태 담기(useEffect갱신용)
  const [markedDate, setMarkDate] = useState(null) //마크할 날짜 담기
  const [markandSelected, setMarkandSelected] = useState(null) //마크+선택 날짜 담기
  const [showSchedule, setShowSchedule] = useState([]) //선택한 날짜 스케쥴 담기
  const [itemKey, setItemKey] = useState('') //삭제할 스케쥴 key 저장
  const [pickColor, setPickColor] = useState('red') //스케쥴 적용할 색상 default: red
  const [pickFriends, setPickFriends] = useState() //내가 고른 친구목록 저장
  
  const today = new Date()
  const pickDay = new Date(selectedDate)

  //같은 날짜 구분
  const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear()
       && date1.getMonth() === date2.getMonth()
       && date1.getDate() === date2.getDate();
  }

  
  //요일 한글화
  LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: 'Aujourd\'hui',
  }
  LocaleConfig.defaultLocale = 'fr'

  //모달창 닫기
  const closeModal = () => {
    setItemKey('')
    setPickFriends('')
    setPickColor('red')
    setOpenModal(false)
  }
  
  //해당 스케쥴 등록
  const addScheduleClick = async() => {
    console.log('할일제목 :', scheduleTitle, '할일 내용 :', scheduleContent)
    console.log('시작:', startDate, '종료:', endDate)

    //파이어베이스에 데이터 추가/수정(제목, 내용 빈칸 아닐때)
    if(scheduleTitle !== '' && scheduleContent !== ''){
      //새로 등록
      const newSchedule = {
        startDay : startDate,
        endDay :  endDate,
        members: pickFriends, // myInfo
        title: scheduleTitle,
        content: scheduleContent,
        pickColor: pickColor,
        createdAt: getCurrentTime(),
        lastModifiedAt: null,
        createdUser: user,
        lastModifedUser: myInfo.name
      }
      //수정 
      const updateSchedule = {
        startDay : startDate,
        endDay :  endDate,
        members: pickFriends,
        title: scheduleTitle,
        content: scheduleContent,
        pickColor: pickColor,
        lastModifiedAt: getCurrentTime(),
        lastModifedUser: myInfo.name
      }

      try{
        //스케쥴 새로 등록(firebase)
        if(itemKey === ''){
          console.log('데이터 추가 :',newSchedule)
          await addSchedule('CalendarSchedule', newSchedule)
          setPickSchedule(!pickSchedule)
          sendNotification(newSchedule.title, newSchedule.content, newSchedule.members)
        }else{
          //스케쥴 수정(firebase)
          console.log('데이터 수정 :',updateSchedule)
          await updateOneSchedule('CalendarSchedule', itemKey, updateSchedule)
          setPickSchedule(!pickSchedule)
          console.log(updateSchedule.title, itemKey)
          //스케쥴과 연동된 채팅방 정보 수정(이름, 멤버)
          await getThisSchedulesChatRoom(itemKey)
          .then(result => {
            console.log('채팅2', result)
            result.docs && result.docs.length !== 0 &&
            console.log('채팅', result.docs[0].data())
            let arr = []
              updateSchedule && updateSchedule.members.map(member => {
                arr.push(member.UID)
              })
              updateChatRoomTitle(result.docs[0].id, updateSchedule.title, arr)
          })
          .catch(err => console.log('채팅정보수정에러', err))
          sendNotification(updateSchedule.title, updateSchedule.content, updateSchedule.members, itemKey)
        }
      }catch(err){
        console.log('스케줄등록/수정 에러',err)
      }

      Keyboard.dismiss()
      setStartDate('')
      setEndDate('')
      setScheduleTitle('')
      setScheduleContent('')
      setItemKey('')
      setPickFriends('')
      setPickColor('red')
      setOpenModal(false)
    }else{
      // console.log('제목&내용이 빈칸입니다.')
      Alert.alert('경고!', '할일 제목이나 내용을 입력해주세요.')
    }
  }

  //시작날짜가 종료날짜보다 느릴시 종료날짜가 시작날짜로 자동 셋팅
  useEffect(() => {
    if(startDate > endDate){
      setEndDate((prev) => [...prev, startDate])
    }
  },[startDate])


  useEffect(() => {
    //현재 로그인한 유저 uid 불러오기
   onAuthStateChanged(auth, (user) => {
    //  console.log(user)
     if(user){
       const uid = user.uid
       setUser(uid)
     }else{
       console.log(`${user}유저정보가 이상합니다`)
     }
   })
   //로그인한 user정보 담기
   getOneSchedule('user', user, 
     function onResult(querySnapshot){
       console.log('myinfo',querySnapshot.data())
       setMyInfo(querySnapshot.data())
     },
     function onError(err){
       console.log('err', err)
     })
     setPickSchedule(!pickSchedule)
 },[user])

        
  useEffect(() => {
    //선택한 날짜 효과 추가
    if(markedDate !== null){
      const markedSelected = {
        ...markedDate,
        [selectedDate]: {
          selected: selectedDate ? true : false,
          marked: markedDate[selectedDate]?.marked,
        }
      }
      setMarkandSelected(markedSelected)
    }
  },[selectedDate])

  //firebase에 등록된 스케쥴 불러오기
  useEffect(() => {
    function onResult(querySnapshot){
      const list = []
      querySnapshot.forEach(doc => {
        // console.log(doc.data())
        //member에 내가 있는 스케쥴만 추려서 담기
        doc.data().members && doc.data().members.map(member => {
          if(member.UID === user){
            // console.log('걸러진데이터',doc.data(), doc.id)
            list.push({...doc.data(), id: doc.id})
          } 
        })

        //담은 스케쥴이 있는 날짜에 마킹
        let marking = list.reduce((acc, leave) => {
          let { startDay, pickColor } = leave
            //스케쥴 시작날짜에 마크찍기
            return {
              ...acc,
              [startDay]:{
                ...(acc[startDay] || {}),
                marked: true,
                dotColor: pickColor 
              }
            }
        },{})
        
        //날짜 빠른순 정렬
        marking = Object.keys(marking)
          .sort()
          .reduce((obj, key) => {
            obj[key] = marking[key]
            return obj
          }, {})
      
        setMarkDate(marking) 
      })
      setLoadSchedule(list)
      let arr = []
      selectedDate && 
      list.forEach(date => {
        //클릭한 날짜가 스케쥴 기간안에 포함될때
        if(date.startDay === selectedDate || date.endDay === selectedDate || selectedDate > date.startDay && selectedDate < date.endDay){
            console.log('일정O', date)
            arr.push(date)
        }
      })
      setShowSchedule(arr)
      console.log('다시셋팅된 show', pickSchedule, showSchedule)    
    }
    function onError(error){
      console.error(`불러오다가 에러났음 - ${error}`)
    }
    return getSchedules('CalendarSchedule', onResult, onError)
    
  },[pickSchedule])
  
  
  // console.log('리스트', markedDate)
  return(
    <SafeAreaView style={styles.block}>
      <Calendar
        style={styles.calendar}
        monthFormat={'yyyy년 MM월'}
        markedDates={markandSelected ? markandSelected : markedDate}
        renderArrow={(direction) => direction === 'left' ? <AntIcon name='left' size={25} color='#BDEDD2'/> : <AntIcon name='right' size={25} color='#BDEDD2'/>}
        theme={{
          backgroundColor: '#eeeeee',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#F7CAC9',
          selectedDayTextColor: '#fff',
          // dotColor: 'red',
          // selectedDotColor: 'red',
          todayTextColor: '#99BFBF',
          // indicatorColor: 'yellow',
          // arrowColor: '#CDDAC3',
          'stylesheet.calendar.header': {
              dayHeader:{
                  color: '#333',
                  fontSize: 13,
              }
          },
          textSectionTitleDisabledColor: 'red',
          // textDisabledColor: 'red',
        }}
        // disableAllTouchEventsForDisabledDays={true} //disabled클릭 안됨
        // markingType={'period'}
        disabledDaysIndexes={[0]}
        onDayPress={day => {
          console.log('선택한날짜', day, selectedDate)
          let arr = []
          loadSchedule.forEach(date => {
              //클릭한 날짜가 스케쥴 기간안에 포함될때
              if(date.startDay === day.dateString || date.endDay === day.dateString || day.dateString > date.startDay && day.dateString < date.endDay){
                  console.log('일정O', date)
                  arr.push(date)
              }
          })
          setShowSchedule(arr)
          setSelectedDate(day.dateString)

        }}
        onDayLongPress={day => {
          console.log('길게누르기',day.dateString)
          setSelectedDate(day.dateString)
          setOpenModal(true)
        }}
      />
      <Text style={[styles.titleText, styles.pickTitle, styles.font]}>{selectedDate ? selectedDate : '날짜를 선택해주세요!'}</Text>
      <View style={[styles.bgWhite, {flex: 1}]}>
        <PickDate selectedDate={selectedDate} loadSchedule={loadSchedule} showSchedule={showSchedule} setShowSchedule={setShowSchedule} itemKey={itemKey} setItemKey={setItemKey} setOpenModal={setOpenModal} pickFriends={pickFriends} navigation={navigation} setSelectRoomId={setSelectRoomId} myInfo={myInfo} pickSchedule={pickSchedule}/>
      </View>
      <Modal
        animationType='fade'
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal)
        }}
        onShow={() => {
          setStartDate(selectedDate)
          setEndDate(selectedDate)
          console.log('key',itemKey)
          //새로운 스케쥴 만들때 members에 내 정보 담기
          if(itemKey === ''){
            const list = []
            list.push(myInfo)
            setPickFriends(list)
            console.log('내정보담기',list)
          }else{
          //스케쥴을 수정하려고 모달창 열때 
            //정보 자동으로 담아 보여주기
            console.log('onshowItemKey',itemKey)
            console.log('1번')
            showSchedule &&
            console.log('2번')
            getOneSchedule('CalendarSchedule', itemKey, 
            function onResult(querySnapshot){
              const list = []
              list.push(querySnapshot.data())
              // console.log('list',list[0])
              setScheduleTitle(list[0].title)
              setScheduleContent(list[0].content)
              setStartDate(list[0].startDay)
              setEndDate(list[0].endDay)
            },
            function onError(err){
              console.log('err', err)
            })
          } 

        }}
      >
        <View style={styles.centerView}>
          {today < pickDay || isSameDate(today, pickDay) ?
            <View style={styles.modal}>
              <Text style={[styles.titleText, styles.font]}>{selectedDate}</Text>
              <View style={styles.inputs}>
                <ModalInputs 
                  selectedDate={selectedDate} 
                  startDate={startDate} setStartDate={setStartDate} 
                  endDate={endDate} setEndDate={setEndDate} 
                  isSameDate={isSameDate}
                />
              </View>
              <View style={styles.textInputs}>
                <ModalTextInputs 
                  scheduleTitle={scheduleTitle} setScheduleTitle={setScheduleTitle} 
                  scheduleContent={scheduleContent} setScheduleContent={setScheduleContent} 
                  itemKey={itemKey}
                />
                <AddMembers showSchedule={showSchedule} itemKey={itemKey} pickFriends={pickFriends} setPickFriends={setPickFriends} myInfo={myInfo}/>
              </View>
              <View>
                <PickColor showSchedule={showSchedule} pickColor={pickColor} setPickColor={setPickColor}/>
              </View>
              <View style={styles.horizontalView}>
                <TouchableOpacity style={[styles.modalBtn, styles.addBtn]} onPress={addScheduleClick}>
                  <Text style={[styles.btnText, styles.font]}>{itemKey !=='' ? '수정' : '등록'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.closeBtn]} onPress={closeModal}>
                  <Text style={[styles.btnText, styles.font]}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            <View style={styles.modal}>
              <Text style={[styles.message, styles.font]}>지난 날짜에는 스케쥴을 추가 할 수 없습니다.</Text>
              <Pressable style={[styles.modalBtn, styles.closeBtn]} onPress={closeModal}>
                <Text style={[styles.btnText, styles.font]}>닫기</Text>
              </Pressable>
            </View>
          }
        </View>
      </Modal>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: '#fff'
  },
  calendar: {
    borderBottomWidth: 1,
    borderColor: '#BDEDD2',
    marginTop: 30,
    },
  day: {
    padding:5,
  },
  dayText: {
    fontSize: 16
  },
  markedDate: {
    backgroundColor: '#00adf5',
    color: '#fff',
    borderRadius: 20,
  },
  plusBtn: {
    backgroundColor: '#BDEDD2',
    borderRadius: 50,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  icon: {
    // fontWeight: 'bold'
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BDEDD2',
    justifyContent: 'center',
    alignItems:'center',
    elevation: 2,
  },
  horizontalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtn: {
    padding: 8,
    width: 80,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex:0,
    elevation:0,
  },
  closeBtn: {
    backgroundColor: '#ddd'
  },
  addBtn: {
    backgroundColor: '#BDEDD2'
  },
  btnText: {
    // fontWeight: 'bold',
  },
  textInputs: {
    marginBottom: 5,
  },
  titleText: {
    fontSize: 18,
    // fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center', 
    padding :8,
  },
  message:{
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  pickTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#BDEDD2',
    backgroundColor: '#BDEDD2'
  },
  todayBtn:{
    padding: 7,
    width: 60,
    backgroundColor: 'red',
    elevation: 2,
    borderRadius: 13,
    margin: 10,
    marginTop: -10
  },
  bgWhite: {
    backgroundColor: '#fff'
  },
  font: {
    fontFamily: 'IM_Hyemin-Bold'
  }
})

export default CalendarScreen;

