const express = require('express');
const admin = require("firebase-admin");
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const serviceAccount = require("./serviceAccountKey.json");
const serviceKey = require('./FirebaseAdminSDKserviceKey.json');
const functions = require('firebase-functions')
const moment = require('moment-timezone')

admin.initializeApp({
  credential: admin.credential.cert(serviceKey),
  databaseURL: "https://reactnative-teamproject-default-rtdb.firebaseio.com"
});

const app = express();
const port = 5300;

app.use(cors())
app.use(express.json());

const listAllUsers = async () => {
  try{
      const listUsersResult = await admin.auth().listUsers();
      const emails = listUsersResult.users.map((userRecord) => userRecord.email);
      return emails;
  }
  catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' }); 
        throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
};

app.get('/', async (req, res) => {
  try {
    const emails = await listAllUsers();
    res.json(emails);
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    throw error; // throw error를 해주지 않으면 catch로 넘어가지 않는다.
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('서버 오류 발생')
})
app.use((req, res, next) => {
  res.status(404).send('경로 찾을 수 없음')
})
app.get('/error', (req, res, next) => {
  throw new Error('서버 문제 발생')
})
exports.schedulePushNotifications = functions.firestore
  .document('Alarms/{alarmId}')
  .onCreate(async (snapshot, context) => {
    const alarmData = snapshot.data();    
    const currentTimeInKorea = moment().tz('Asia/Seoul');    
    const alarmTime = moment(alarmData.time);

    if (alarmTime.isSame(currentTimeInKorea)) {
      const message = {
        token: alarmData.deviceToken,
        notification: {
          title: 'Alarm Notification',
          body: alarmData.title,
        },
        data: {
          type: 'YourNotificationType', 
        },
      };
      
      await admin.messaging().send(message);
    }
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = app;
