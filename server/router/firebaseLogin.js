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
const registerFirebaseDB = async (email, uid, displayName) => {
  const userData = db.collection('user').doc('uid');
  const res = await userData.set({
    email: email,
    uid: uid,
    displayName: displayName,
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

// 등록된 모든 유저의 이메일을 가져오는 함수
const listAllUsers = async () => {
  try{
      const listUsersResult = await admin.auth().listUsers();
      const emails = listUsersResult.users.map((userRecord) => userRecord.email);
      return emails; // return Promise(emails)
  }
  catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' }); 
        throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
};

router.get('/', expressAsyncHandler (async(req, res) => {
  try {
    const emails = await listAllUsers();
    console.log(emails)
    res.json(emails);
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}));


module.exports = router
// 아래를 객체로 묶으면 오류가 난다, 이유는 모르겠음.
module.exports.signUpUser = signUpUser;
module.exports.listAllUsers = listAllUsers;
module.exports.registerFirebaseDB = registerFirebaseDB;
