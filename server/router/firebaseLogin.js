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
  const userData = db.collection('user').doc(uid);
  const res = await userData.set({
    UID: uid,
    email: email,
    name: displayName,
  }, { merge: true });
}


// 유저정보 Authentication에 등록 
const signUpUser = async (email, password, displayName) => {
  const auth = admin.auth(); // auth 객체를 가져옵니다.
  const userRecord = await auth.createUser({
    email: email,
    password: password,
    displayName: displayName,
  });
  console.log('유저등록에 성공했습니다:', userRecord.uid);
  return userRecord;
};

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
    res.json(userRecord)
    console.log('유저레코드 :', userRecord.uid)

    registerFirebaseDB(userRecord.uid, userRecord.email, userRecord.displayName) // DB등록 함수
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}))

// 로그아웃
router.get('/logout', expressAsyncHandler (async(req, res) => {
  try {
    console.log('쿠키지우기전 :',req.cookies.session)
    res.clearCookie('session');
    console.log('쿠키지운후 :',req.cookies.session)

  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}))

module.exports = router
// 아래를 객체로 묶으면 오류가 난다, 이유는 모르겠음.
module.exports.signUpUser = signUpUser;
module.exports.listAllUsers = listAllUsers;
module.exports.registerFirebaseDB = registerFirebaseDB;
