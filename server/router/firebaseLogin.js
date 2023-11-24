const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const schedule = require('node-schedule')
const fetch = require('node-fetch')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactnative-teamproject-default-rtdb.firebaseio.com"
});

const db = getFirestore();

// 유저정보 Firestore database에 등록
const registerFirebaseDB = async (uid, email, displayName) => {
  const userData = db.collection('user').doc(uid);
  const res = userData.set({
    UID: uid,
    email: email,
    name: displayName,
    friends: [],
  }, { merge: true })

  console.log('유저등록(DB)에 성공했습니다(firebaselogin.js):');
}

// 유저정보 Authentication에 등록 (네이버 / 카카오 로그인)
const signUpUserwithNaverKakao = async (email, password, displayName) => {
  try {
    const auth = admin.auth(); // auth 객체를 가져옵니다.

    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      friends: [],
    });
    console.log('유저등록에 성공했습니다(firebaselogin.js):', userRecord?.uid);
    registerFirebaseDB(userRecord?.uid, email, displayName); // 유저정보 Firestore database에 등록
    return userRecord;
  } catch (error) {
    console.log('유저등록 에러(firebaseLogin 43) :', error);
  }
};


// 유저정보 Authentication에 등록  (일반 회원가입)
const signUpUser = async (email, password, displayName) => {
  const auth = admin.auth(); // auth 객체를 가져옵니다.
  const userRecord = await auth.createUser({
    email: email,
    password: password,
    displayName: displayName,
  });
  console.log('유저등록에 성공했습니다(firebaselogin.js):', userRecord.uid);
  return userRecord;
};

// 등록된 모든 유저의 정보를(이메일, uid, 닉네임) 가져오는 함수
const listAllUsers = async () => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const userInfo = listUsersResult.users.map((userRecord) => { return { email: userRecord.email, password: userRecord.uid, displayName: userRecord.displayName } });
    return userInfo; // return Promise(emails)
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
};


// 이메일 찾기 (가입한 이메일로 새로운 비밀번호 전송)
router.get('/', expressAsyncHandler(async (req, res) => {
  try {
    const userInfo = await listAllUsers();
    const userEmail = userInfo.map((user) => { return user.email })
    console.log('유저이메일 :', userEmail)
    res.json(userEmail);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}));

// 유저등록
router.post('/register', expressAsyncHandler(async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const userRecord = await signUpUser(email, password, displayName);
    res.json(userRecord)
    registerFirebaseDB(userRecord.uid, userRecord.email, userRecord.displayName) // DB등록 함수
  } catch (e) {
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
router.get('/logout', expressAsyncHandler(async (req, res) => {
  try {
    req.session.destroy(); // 세션 삭제
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}))

//푸쉬 알람
const scheduledJobs = {}
router.post('/msg', expressAsyncHandler(async (req, res) => {
  const alarmTime = req.body.time
  const alarmTitle = req.body.title
  const alarmId =  req.body.id
  const uid = req.body.uid
  const userDB = await db.collection('user').doc(uid).get()
  const token = userDB._fieldsProto.FCMToken.stringValue
  console.log('추가알람', alarmId)
  
  const date = new Date(alarmTime).getTime();
  const newDate = new Date(date)
  console.log('date : ', alarmTime)

  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  console.log('time', month, day, hours, minutes)

  const jobKey = `${minutes} ${hours} ${day} ${month} *`

  scheduledJobs[jobKey] = schedule.scheduleJob(alarmId, jobKey, async () => {
    console.log('msg보냅니다!!')

    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer AAAAWP_U7E0:APA91bEdq5O0nBGVKCzygO0vLXHyxOVCCWijzckG_LV7FC278Nq9SfbJpzzukeXvB2Ekm1jssLkKvzqaAezJm0MwNDfU5IiwHzMGUvZnQK3DNGbBJhB0ujHDGsx2rkSg7ETd4pQEuPL-`
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: `${hours} : ${minutes}`,
          body: alarmTitle,
          "mutable_content": true,
          "sound": "Tri-tone"
        },
        data: {
          'type': 'alarm'
        }
      })
    })
      .catch(e => console.log(e))
      .then(r => {
        console.log(r)
        res.json('알람이 등록되었습니다')
      })
  })  
}))

router.post('/cancel', expressAsyncHandler(async (req, res) => {
  const id = req.body.id  
  console.log('삭제알람', id)
  schedule.cancelJob(id)
  res.json('알람이 삭제되었습니다.')
}))

module.exports = router
// 아래를 객체로 묶으면 오류가 난다, 이유는 모르겠음.
module.exports.signUpUserwithNaverKakao = signUpUserwithNaverKakao;
module.exports.signUpUser = signUpUser;
module.exports.listAllUsers = listAllUsers;
module.exports.registerFirebaseDB = registerFirebaseDB;
