const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactnative-teamproject-default-rtdb.firebaseio.com"
});

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
    res.json(emails);
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
}));


module.exports = router;
