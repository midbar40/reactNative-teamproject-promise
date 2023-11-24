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

export const searchUserByEmail = async (UID) => {
    console.log('searchUserByEmail :',UID)
    try {
        // const searchUser = await firestore().collection('user').where('UID','==',UID).get();
        const searchUser = await firestore().collection('user').get();
        const searchUserUid = searchUser.docs.filter(doc => 
            doc._data.UID.includes(UID))
        if(searchUser.docs.length === 0){
            return false
        } else {
            return searchUserUid;
        }
    } catch (error) {
        console.log(error)
    }
    
}
// 친구 등록
export const addFriend = async (newFriend) => {
        try {
            console.log('애드프렌즈 ')
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
// DB에 있는 나의 친구 조회(실시간)
export const getFriendsRealtimeChange = (onResult, onError) => {
        const myUID = getUser()?.uid;
        return firestore()
        .collection(`user`)
        .doc(`${myUID}`)
        // .orderBy('date', 'asc')
        .onSnapshot(onResult, onError);
}

// DB에 있는 나의 친구 조회(1회)
export const getFriendsOnce = async () => { 
    if(getUser() !== null){ 
    const myUID = getUser()?.uid;
    const myDBData = await firestore()
    .collection(`user`)
    .doc(`${myUID}`).get();
    // console.log('once : ',myDBData.data().friends)
    return myDBData.data().friends;
}
}


// 로그인시 firestore에 추가 (구글용)
export const addUserData = async (user) => {
    try{
        // 유저정보 추가
      const userProfile = await firestore().collection('user').doc(user.uid).set({
            UID: user.uid,
            email : user.email,
            name : user.displayName,
            friends : [],
        })
        console.log('client firebase.js 등록성공: ',userProfile)
        return true
    }catch(error){
        console.log('client firebase.js 등록에러: ',error)
    }
}