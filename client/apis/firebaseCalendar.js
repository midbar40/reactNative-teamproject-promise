import firestore from '@react-native-firebase/firestore';

export const addSchedule = async ( name, data ) => {
  await firestore().collection(name).add(data)
  console.log(`${name}: ${JSON.stringify(data)} 파이어베이스 추가`)
}

export const getSchedules = ( name, onResult, onError) => {
  return  firestore().collection(name).onSnapshot(onResult, onError)
}