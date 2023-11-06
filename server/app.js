const express = require('express');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactnative-teamproject-default-rtdb.firebaseio.com"
});

const app = express();
const port = 5300;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = app;
