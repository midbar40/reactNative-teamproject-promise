import React,{ useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, FlatList, Pressable, Modal, TextInput } from 'react-native';
import { Calendar,  CalendarList, Agenda, LocaleConfig } from 'react-native-calendars'

import AntIcon from 'react-native-vector-icons/AntDesign'

import PickDate from '../components/PickDate';
import ModalInputs from '../components/ModalInputs';
import ModalTextInputs from '../components/ModalTextInputs'

function CalendarScreen() {

    const [selectedDate, setSelectedDate] = useState('') //선택한 날짜 담기
    const [openModal, setOpenModal] = useState(false) //모달창 열기
    const [startDate, setStartDate] = useState({ year:'', month: '', date: '' }) //시작날짜
    const [endDate, setEndDate] = useState({ year:'', month: '', date: '' }) //종료날짜
    const [scheduleTitle, setScheduleTitle] = useState('') //할일 제목
    const [scheduleContent, setScheduleContent] = useState('') //할일 내용

    const today = new Date()
    const pickDay = new Date(selectedDate)
    
    console.log('오늘',today, '선택:',selectedDate,)

    //같은 날짜 구분
    const isSameDate = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear()
           && date1.getMonth() === date2.getMonth()
           && date1.getDate() === date2.getDate();
      }

    // console.log(today, pickDay, '미래?', today < pickDay, '같은날짜', isSameDate(today, pickDay))

    //마크 찍기 테스트
    const markedDates = {
        [selectedDate]: {selected: true},
        '2023-11-07': {periods:[{startingDay: true, endingDay: false, color:'green'},{startingDay:true, endingDay: true, color:'pink'}]},
        '2023-11-08': {periods:[{startingDay: false, endingDay: false, color:'green'}]},
        '2023-11-09': {periods:[{startingDay: false, endingDay: true, color:'green'}]},
        // '2023-11-15': {startingDay: true, endingDay: true, color:'skyblue'},
        '2023-11-05': {color: 'red'},
        //마크되어있는날 selected하면 둘다 표시되게 하기
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

    //모달창 열기 - 버튼 사용유무 보류
    // const open = () => {
    //     console.log('모달창열기')
    //     setOpenModal(true)
    // }

    //모달창 닫기
    const closeModal = () => {
        setOpenModal(false)
    }

    //해당 스케쥴 등록
    const addSchedule = () => {
        console.log(`${selectedDate}의 스케쥴을 추가하겠읍니다.`)
        console.log('할일제목 :', scheduleTitle, '할일 내용 :', scheduleContent)
        setOpenModal(false)
        // setStartDate({ year:'', month: '', date: '' })
        // setEndDate({ year:'', month: '', date: '' })
        console.log('시작:', startDate)
        console.log('종료:', endDate)
    }
    
    //시작날짜가 종료날짜보다 느릴시 종료날짜가 시작날짜로 자동 셋팅
    useEffect(() => {
        if(startDate.year > endDate.year){
            setEndDate((prev) => ({...prev, year:startDate.year}))
            console.log('연도빠름', startDate.year > endDate.year, endDate)
        }else if(startDate.month > endDate.month){
            setEndDate((prev) => ({...prev, month:startDate.month}))
            console.log('월빠름', startDate.month > endDate.month, endDate)
        }else if(startDate.date > endDate.date){
            setEndDate((prev) => ({...prev, date:startDate.date}))
            console.log('일빠름', startDate.date > endDate.date, endDate)
        }
    },[startDate])

    return(
        <SafeAreaView style={styles.block}>
            <Calendar
                style={styles.calendar}
                monthFormat={'yyyy년 MM월'}
                markedDates={markedDates}
                renderArrow={(direction) => direction === 'left' ? <AntIcon name='left' size={25} color='lightgreen'/> : <AntIcon name='right' size={25} color='lightgreen'/>}
                theme={{
                    backgroundColor: '#eeeeee',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#fff',
                    // dotColor: 'red',
                    selectedDotColor: 'red',
                    todayTextColor: 'orange',
                    indicatorColor: 'yellow',
                    arrowColor: 'lightgreen',
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
                markingType={'multi-period'}
                disabledDaysIndexes={[0]}
                onDayPress={(day,state) => {
                    console.log('선택한날짜', day)
                    setSelectedDate(day.dateString)
                }}
                onDayLongPress={day => {
                    console.log('길게누르기',day.dateString)
                    setSelectedDate(day.dateString)
                    setOpenModal(true)
                }}
                
            />
            <PickDate selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            {/* <Pressable style={styles.plusBtn} onPress={open}>
                <Text style={styles.icon}>
                    <AntIcon name='plus' size={20}/>
                </Text>
            </Pressable> */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={openModal}
                onRequestClose={() => {
                    setOpenModal(!openModal)  
                }}
                onShow={() => {
                    setStartDate({
                        year:`${selectedDate.slice(0,4)}년`,
                        month:`${selectedDate.slice(5,7)}월`,
                        date:`${selectedDate.slice(8,10)}일`
                      })
                      setEndDate({
                        year:`${selectedDate.slice(0,4)}년`,
                        month:`${selectedDate.slice(5,7)}월`,
                        date:`${selectedDate.slice(8,10)}일`
                      })
                }}
            >
                <View style={styles.centerView}>
                    {today < pickDay || isSameDate(today, pickDay) ?
                        <View style={styles.modal}>
                            <Text style={styles.titleText}>
                                {selectedDate}
                            </Text>
                            <View style={styles.inputs}>
                                <ModalInputs modalTitle='시작날짜' selectedDate={selectedDate} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
                                <ModalInputs modalTitle='종료날짜' selectedDate={selectedDate} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
                            </View>
                            <View style={styles.textInputs}>
                                <ModalTextInputs title='할일 제목' setScheduleTitle={setScheduleTitle}/>
                                <ModalTextInputs title='할일 내용' setScheduleContent={setScheduleContent}/>
                            </View>
                            <View style={styles.horizontalView}>
                                <Pressable style={[styles.modalBtn, styles.closeBtn]} onPress={closeModal}>
                                    <Text style={styles.btnText}>취소</Text>
                                </Pressable>
                                <Pressable style={[styles.modalBtn, styles.addBtn]} onPress={addSchedule}>
                                    <Text style={styles.btnText}>등록</Text>
                                </Pressable>
                            </View>
                        </View>
                        :
                        <View style={styles.modal}>
                            <Text style={styles.titleText}>지난 날짜는 스케쥴을 추가할 수 없습니다.</Text>
                            <Pressable style={[styles.modalBtn, styles.closeBtn]} onPress={closeModal}>
                                <Text style={styles.btnText}>닫기</Text>
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
    },
    calendar: {
      borderWidth: 1,
      borderColor: 'lightgreen',
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
        backgroundColor: 'lightgreen',
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
        fontWeight: 'bold'
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
        borderColor: 'lightgreen',
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
        backgroundColor: 'lightgreen'
    },
    btnText: {
        fontWeight: 'bold',
    },
    textInputs: {
        marginBottom: 5,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    }
  })

export default CalendarScreen;
