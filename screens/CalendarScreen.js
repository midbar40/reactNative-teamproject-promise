import React,{ useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, FlatList, Pressable, Modal } from 'react-native';
import { Calendar,  CalendarList, Agenda, LocaleConfig } from 'react-native-calendars'

import AntIcon from 'react-native-vector-icons/AntDesign'

import PickDate from '../components/PickDate';
import ModalInputs from '../components/ModalInputs';

function CalendarScreen() {

    const [selectedDate, setSelectedDate] = useState('') //선택한 날짜 담기
    const [openModal, setOpenModal] = useState(false) //모달창 열기
    const [startDate, setStartDate] = useState({ year:'', month: '', date: '' }) //시작날짜
    const [endDate, setEndDate] = useState({ year:'', month: '', date: '' }) //종료날짜
    console.log('선택:',selectedDate, )

    //마크 찍기 테스트
    const markedDates = {
        '2023-11-07': {marked: true},
        '2023-11-09': {marked: true},
        [selectedDate]: {selected: true},
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
        setOpenModal(false)
        // setStartDate({ year:'', month: '', date: '' })
        // setEndDate({ year:'', month: '', date: '' })
        console.log('시작:', startDate)
        console.log('종료:', endDate)
    }
    
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
                    selectedDayTextColor: '#ffffff',
                    dotColor: 'red',
                    selectedDotColor: 'red',
                    todayTextColor: 'orange',
                    indicatorColor: 'yellow',
                    arrowColor: 'lightgreen',
                    'stylesheet.calendar.header': {
                        dayHeader:{
                            color: '#333',
                            fontSize: 13
                        }
                    }
                }}
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
                    <View style={styles.modal}>
                        <Text>
                            {selectedDate}
                        </Text>
                        <View>
                            <ModalInputs modalTitle='시작날짜' selectedDate={selectedDate} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
                            <ModalInputs modalTitle='종료날짜' selectedDate={selectedDate} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
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
    },
    closeBtn: {
        backgroundColor: '#ddd'
    },
    addBtn: {
        backgroundColor: 'lightgreen'
    },
    btnText: {
        fontWeight: 'bold',
    }
  })

export default CalendarScreen;
