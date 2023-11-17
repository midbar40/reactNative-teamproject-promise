const express = require('express');
const admin = require("firebase-admin");
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const serviceAccount = require("./serviceAccountKey.json");
const serviceKey = require('./FirebaseAdminSDKserviceKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceKey),
  databaseURL: "https://reactnative-teamproject-default-rtdb.firebaseio.com"
});

const app = express();
const port = 5300;
const corsOptions = {
  origin: '*',
  credentials: true,
}

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

// app.get('/check-alarms', async(req, res) => {
//   try{
//     const alarmSnapShot = await admin.firestore().collection('Alarms').get()
//     const alarms = alarmSnapShot.docs.map(doc => doc.data())

//     const currentTime = new Date().toLocaleDateString('en-US', {timeZone: 'Asia/Seoul'})

//     const matchingAlarms = alarms.filter(alarm => {
//       const alarmTime = new Date(alarm.time).toDateString('en-US', {timeZone: 'Asia/Seoul'})
//       return alarmTime === currentTime
//     })

//     matchingAlarms.forEach(alarm => {
//       sendPushNotification(alarm)
//     })
//     res.json({success: true, message: '알람을 확인하고 알림을 보냈습니다.'})
//   }catch(error){
//     console.error(error)
//     res.status(500).json({error: '인터넷 서버오류'})
//   }
// })

// const sendPushNotification = (alarm) => {

// }
///////////////////////////////////////////////////////////////

const sendPushNotification = (deviceToken, title, body) => {
  
};

const checkAlarms = async () => {
  try {
    const alarmsSnapshot = await admin.firestore().collection('Alarms').get();

    alarmsSnapshot.forEach((doc) => {
      const alarm = doc.data();
      const alarmTime = moment(alarm.time);
      const currentTime = moment().tz('Asia/Seoul');

      if (alarmTime.isSame(currentTime, 'minute')) {        
        sendPushNotification(alarm.deviceToken, 'Alarm', alarm.title);
        
        admin.firestore().collection('Alarms').doc(doc.id).update({ sent: true });
      }
    });
  } catch (error) {
    console.error('알람 확인 에러:', error);
  }
}
setInterval(checkAlarms, 60000);

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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = app;
