import firestore from '@react-native-firebase/firestore'

const getRef = (collections) => {
  return firestore().collection(collections)
}
export const addData = async (collections, data) => {
  await getRef(collections).doc(data.id).set(data)
  console.log(`${collections} : ${JSON.stringify(data)} 파이어베이스에 추가!`)
}
export const updateDate = async (collections, id, data) => {
  await getRef(collections).doc(id).update(data)
}
export const removeData = async (collections, id) => {
  await getRef(collections).doc(id).delete()
  console.log(`${collections} : ${JSON.stringify(id)} 파이어베이스에서 삭제!`)
}
export const getCollection = (collections, onResult, onError, query, order, limit) => {
  let ref = getRef(collections)

  // 조건쿼리
  if (query && query.exists && query.condition && query.condition.length !== 0) {
    for (let cond of query.condition) {
      ref = ref.where(...cond)
    }
  }
  if (order && order.exists && order.condition && order.condition.length !== 0) {
    ref = ref.orderBy(...order.condition)
  }
  if (limit && limit.exists && limit.condition) {
    ref = ref.limit(limit.condition)
  }
  return ref.onSnapshot(onResult, onError)
}
export const getCurrentTime = () => {
  return firestore.FieldValue.serverTimestamp()
}

export const changeTimeFormat = (date) => {
  return firestore.Timestamp.fromDate(date)
}