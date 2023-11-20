const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactnative-teamproject-default-rtdb.firebaseio.com"
});

const db = getFirestore();

// 유저정보 Firestore database에 등록
const registerFirebaseDB = async (uid, email, displayName) => {
  console.log('파이어베이스 등록정보' , uid, email, displayName)
  try{
    if(uid === undefined || email === undefined || displayName === undefined){
      throw new Error('유저정보가 없습니다(firebaselogin.js, 21)')
    } else {
      const userData = db.collection('user').doc(uid);
      console.log('파이어베이스 등록정보' , userData)
      const res = userData.set({
        UID: uid,
        email: email,
        name: displayName,
        friends: [],
      }, { merge: true })
        console.log('유저등록(DB)에 성공했습니다(firebaselogin.js):');
    }
  }
    catch(err){
        console.log('유저등록(DB)에 실패했습니다(firebaselogin.js, 30):', err)
    }
}

// 유저정보 Authentication에 등록 (네이버 / 카카오 로그인)
const signUpUserwithNaverKakao = async (email, password, displayName) => {
  try{
    const auth = admin.auth(); // auth 객체를 가져옵니다.
  const userRecord = await auth.createUser({
    email: email,
    password: password,
    displayName: displayName,
    friends:  [],
  });
  console.log('유저등록에 성공했습니다(firebaselogin.js):', userRecord?.uid);
    registerFirebaseDB(userRecord?.uid, email, displayName); // 유저정보 Firestore database에 등록
  return userRecord;
  } catch(error){
    console.log('유저등록 에러(firebaseLogin 43) :',error);
    }
};


// 유저정보 Authentication에 등록  (일반 회원가입)
const signUpUser = async (email, password, displayName) => {
  try{
    const auth = admin.auth(); // auth 객체를 가져옵니다.
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      friends:  [],
    });
    console.log('유저등록에 성공했습니다(firebaselogin.js):', userRecord.uid);
    return userRecord;
  }
 catch (e) {
  switch (e.code) {
    case 'auth/email-already-exists':
      return console.log('이미 가입된 이메일입니다');
  case 'auth/invalid-email':
    return console.log('이메일 형식이 올바르지 않습니다');
  case 'auth/invalid-password':
    return console.log('비밀번호는 6자리 이상이어야 합니다');
  default:
    return console.log('회원가입이 처리되지 않았습니다');
  }
}
}

// 파이어베이스 구글로그인 유저등록 (auth, db)
router.post('/googleSignUp', expressAsyncHandler (async(req, res) => {
 const registedUser = await listAllUsers()
 const registedUserEmail = registedUser.map(user=> {return user.email})
  try{
      if(registedUserEmail.includes(req.body.email)){
         console.log('이미 가입된 이메일입니다')
         res.json('이미 가입된 이메일입니다')
      } else {
        const userRecord = await signUpUser(req.body.email, req.body.password, req.body.displayName)
        await registerFirebaseDB(userRecord?.uid, userRecord?.email, userRecord?.displayName); // 유저정보 Firestore database에 등록
        res.json(userRecord);
      }
  
      }  catch(err)      {
        console.log('구글 유저등록 에러(firebaseLogin 92) :',err)
      }
  }
))


// 등록된 모든 유저의 정보를(이메일, uid, 닉네임) 가져오는 함수
const listAllUsers = async () => {
  try{
      const listUsersResult = await admin.auth().listUsers();
      const userInfo = listUsersResult.users.map((userRecord) => {return {email: userRecord.email, password: userRecord.uid ,displayName: userRecord.displayName}});
      return userInfo; // return Promise(emails)
  }
  catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' }); 
        throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
};


// 이메일 찾기 (가입한 이메일로 새로운 비밀번호 전송)
router.get('/', expressAsyncHandler (async(req, res) => {
  try {
    const userInfo = await listAllUsers();
    const userEmail = userInfo.map((user) => { return user.email })
    console.log('유저이메일 :', userEmail)
    res.json(userEmail);
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}));

// 유저등록
router.post('/register', expressAsyncHandler (async(req, res) => {
  try {
    const {email, password, displayName} = req.body;
    const userRecord = await signUpUser(email, password, displayName);
    console.log('유저레코드 :', userRecord.uid)
    
    registerFirebaseDB(userRecord.uid, userRecord.email, userRecord.displayName) // DB등록 함수
    res.json(userRecord)
  } catch(e) {
    console.log('회원가입 오류 :', e.code)
    switch (e.code) {
      case 'auth/email-already-exists':
        return res.json('이미 가입된 이메일입니다');
        case 'auth/invalid-email':
          return res.json('이메일 형식이 올바르지 않습니다');
          case 'auth/invalid-password':
            return res.json('비밀번호는 6자리 이상이어야 합니다');
            default:
              return res.json('회원가입이 처리되지 않았습니다');
            }
  }
}))

// 로그아웃
router.get('/logout', expressAsyncHandler (async(req, res) => {
  try {
    req.session.destroy(); // 세션 삭제
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}))

module.exports = router
// 아래를 객체로 묶으면 오류가 난다, 이유는 모르겠음.
module.exports.signUpUserwithNaverKakao = signUpUserwithNaverKakao;
module.exports.signUpUser = signUpUser;
module.exports.listAllUsers = listAllUsers;
module.exports.registerFirebaseDB = registerFirebaseDB;
