import firestore from '@react-native-firebase/firestore';

//등록
export const addSchedule = async ( name, data ) => {
  await firestore().collection(name).add(data)
  console.log(`${name}: ${JSON.stringify(data)} 파이어베이스 추가`)
}

<<<<<<< HEAD
//가져오기
=======
//전체 스케쥴 가져오기
>>>>>>> develop
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