import firestore from '@react-native-firebase/firestore';
import { getUser } from '../apis/auth';
import messaging from '@react-native-firebase/messaging';
import { MESSAGE_SERVICE_KEY } from '@env';

//등록
export const addSchedule = async ( name, data ) => {
  await firestore().collection(name).add(data)
  // console.log(`${name}: ${JSON.stringify(data)} 파이어베이스 추가`)
}

//전체 스케쥴 가져오기
export const getSchedules = ( name, onResult, onError) => {
  return  firestore().collection(name).onSnapshot(onResult, onError)
}

//할일 1개 가져오기
export const getOneSchedule = (name, id, onResult, onError) => {
  return firestore().collection(name).doc(id).onSnapshot(onResult, onError)
}

//삭제
export const removeSchedule = async ( name, id ) => {
  await firestore().collection(name).doc(id).delete()
}

//수정
export const updateOneSchedule = async (name, id, data) => {
  await firestore().collection(name).doc(id).update(data)
}

//해당 스케쥴로 만들어진 chat 데이터 가져오기
export const getThisSchedulesChatRoom = async ( calendarUID ) => {
  return firestore().collection('chat').where('calendarUID','==', calendarUID).get()
}

//해당 스케쥴로 만들어진 chat 데이터 삭제
export const deleteThisSchedulesChatRoom = async ( id ) => {
  await firestore().collection('chat').doc(id).delete()
}

//해당 스케쥴 title 변경시 채팅방 이름 함께 변경
export const updateChatRoomTitle = async ( id, newTitle, members ) =>{
  await firestore().collection('chat').doc(id).update({
    title: newTitle,
    joinUser: members
  })
}


//푸쉬알림
export const sendNotification = async (title, content, members, calendarUID) => {
  const FCMTokens = calendarUID ? await getMemberFCMTokens(calendarUID) : await getNewMemberFCMTokens(members)
  // const memberNames = []
  // const memberLists = members.map(member => memberNames.push(member.name))

  FCMTokens.forEach(t => {
    try {
      fetch('https://fcm.googleapis.com/fcm/send', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${MESSAGE_SERVICE_KEY}`
      },
      body : JSON.stringify({
        "to": `${t}`,
        "notification": {
          "title": calendarUID ? `스케쥴이 변경되었습니다.` : `새로운 스케쥴이 등록되었습니다.` ,
          "body": `제목: ${title}, 내용: ${content}`,
          // "body": `제목: ${title}, 내용: ${content}, 멤버:${memberNames.join(', ')}`,
          "mutable_content": true,
          // "sound": "Tri-tone"
          }
      })
    })
    .catch(e => console.log('catch',e))
    .then(r => console.log('then',r))
    } catch (error) {
      console.log('noti error : ',error)
    }
  })
}

// 스케쥴 수정시 members 유저들의 FCM토큰 반환
export const getMemberFCMTokens = async (calendarUID) => {
  const myUID = getUser().uid;
  try {
    const getCalendarData = await firestore().collection('CalendarSchedule').doc(calendarUID).get();
    const members = getCalendarData.data().members.filter(u => u.UID !== myUID );
    // console.log(joinUsers)

    const FCMTokens = await Promise.all(members.map(async uid => {
      try {
        const token = await firestore().collection('user').doc(`${uid.UID}`).get();
        // console.log(token.data().FCMToken);
        return token.data().FCMToken;
      } catch (error) {
        console.log('tokenErr',error)
      }
    }))
    return FCMTokens;
    
  } catch (error) {
    console.log('getMemberFCMTokensErr : ',error)
  }
}

// 스케쥴 등록시 members 유저들의 FCM토큰 반환
export const getNewMemberFCMTokens = async (members) => {
  const myUID = getUser().uid
  try {
    const memberList = members.filter(member => member.UID !== myUID)

    const FCMTokens = await Promise.all(memberList.map(async uid => {
      console.log('fcmtokenUID',uid)
      try{
        const token = await firestore().collection('user').doc(uid.UID).get();
        return token.data().FCMToken;
      }catch(err){
        console.log('newMembertokenErr',err)
      }
    }))
    return FCMTokens
  }catch(err){
    console.log('getNewMemberFCMTokensErr : ', err)
  }
}