const express = require('express');
const router = express.Router();

router.get('/push', (req, res, next) => {
  const token = 'eOVAgS6vRre_2IB7vvspxp:APA91bHJj7fjXpQDQlirYznep0ssJ6AvqfnClbUWuLcMvH2UsSvCEmbWwFyAZNobBwGTrXSCuoP7HZzOWPt4OgclIRFYLrHnH-K2u1oSjqcziQlE5-vOUXidNYx39chGt7WLtRyaHq3v'

  const message = {
    data: {
      title: '푸시알림 테스트',
      body: '푸시알림 테스트 입니다.',
      style: '테스트',
    },
    token: token
  }

  admin
  .messaging()
  .send(message)
  .then(function (response){
    console.log('successfully:', response)
  })
  .catch(function(err){
    console.log('Error:', err)
  })
})