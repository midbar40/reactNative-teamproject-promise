import firestore from '@react-native-firebase/firestore';
import { getUser } from './auth';

const getRef = (collections) => {
    return firestore().collection(collections);
}
export const addData = async (collections, data) => {
    await getRef(collections).add(data)
    console.log(`${collections} : ${JSON.stringify(data)} added in firestore!`)
}
export const getCollection = (collections, onResult, onError, query, order, limit) => {
    let ref = getRef(collections)
    
    // 조건쿼리
    if(query && query.exists && query.condition && query.condition.length !== 0){
        ref = ref.where(...query.condition)
    }
    if(order && order.exists && order.condition && order.condition.length !== 0){
        ref = ref.orderBy(...order.condition)
    }
    if(limit && limit.exists && limit.condition){
        ref = ref.limit(limit.condition)
    }
    return ref.onSnapshot(onResult, onError)
}
export const getCurrentTime = () => {
    return firestore.FieldValue.serverTimestamp()
}

export const searchUserByEmail = async (email) => {
    try {
        const searchUser = await firestore().collection('user').where('email','==',email).get();
        if(searchUser.docs.length === 0){
            return false
        } else {
            return searchUser.docs[0];
        }
    } catch (error) {
        console.log(error)
    }
    
}

export const addFriend = async (newFriend) => {
        try {
            const myUID = getUser().uid;
            const myDB = await firestore().collection('user').doc(myUID).get();
            const { name, email, friends } = myDB.data();
            const filterFriend = friends.filter(f => f.UID === newFriend.UID)
            // console.log('fil : ',newFriend)
            if(filterFriend.length !== 0){
                return false;
            } else {
                const otherDB = await firestore().collection('user').doc(newFriend.UID).get();
                const otherFriends = otherDB.data().friends;
                // console.log('my', friends)
                // console.log('other', otherFriends)
                await firestore().collection('user').doc(myUID).update({
                    friends : [...friends, newFriend]
                });
                await firestore().collection('user').doc(newFriend.UID).update({
                    friends : [...otherFriends, { name, email, UID : myUID }]
                });
                return true;
            }
        } catch (error) {
            console.log(error);
        }
}

export const getFriends = (onResult, onError) => {
    const myUID = getUser().uid;
    return firestore()
      .collection(`user`)
      .doc(`${myUID}`)
      // .orderBy('date', 'asc')
      .onSnapshot(onResult, onError);
  }