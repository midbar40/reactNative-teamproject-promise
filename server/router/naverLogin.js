const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const cheerio = require('cheerio');
const router = express.Router();
const config = require('../config.js')
const {signUpUser, listAllUsers, registerFirebaseDB  } = require('./firebaseLogin.js')
const client_id = config.NAVER_CLIENT_ID;
const client_secret = config.NAVER_CLIENT_SECRET;
let state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const redirectURI = encodeURI(`${config.NAVER_REDIRECT_URI}`);


// 로그인
router.get('/', expressAsyncHandler(async (req, res) => {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  res.json({API_URL : api_url})
  console.log("네이버 로그인 버튼 클릭: ",api_url) 
}))

// 로그인 콜백
router.get('/callback', expressAsyncHandler(async (req, res) => {
  code = req.query.code;
  state = req.query.state;
  api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' 
   + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
   console.log("로그인버튼 클릭: ",api_url)
 
   
   await fetch(api_url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
   })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('토큰체크 :' , responseJson)

      let token = responseJson.access_token
      let header = "Bearer " + token // Bearer 다음에 공백 추가
      return fetch('https://openapi.naver.com/v1/nid/me', {
        method: 'GET',
        headers: { 'Authorization': header }
      })
      .then((res) => res.json())
      .then((responseData) => {
        console.log(responseData)
        try{
          res.json(responseData)
          // 기존 유저가 아닐경우에만 등록되도록 해야한다.
          // const userEmail = listAllUsers()
          // const userEmailJson = Promise.all(userEmail)
          // console.log('이거실행됨 :', userEmailJson)
          // signUpUser(responseData.response.email, responseData.response.id, responseData.response.nickname) // 네이버 유저정보가 firebase Auth에 등록된다
          // .then(userRecord=>
          //  { console.log(userRecord)
          //   registerFirebaseDB(userRecord.email, userRecord.uid, userRecord.displayName)}) // 네이버 유저정보가 firebase DB에 등록된다
            // sns로 로그인했을때 firebase에 비밀번호를 어떻게 등록해야할지? sns로 로그인했을때 firebase에 login처리를 어떻게 해야할지?
            // 어떤 사이트에서는 sns로 로그인을 하고나서 회원가입 페이지로 이동해서 추가정보를 입력받는다.
            // 다음 화면에서 다시 sns로그인이 아닌 기존 로그인 방식으로 로그인을 하게끔 한다.
            // sns로그인은 고객의 정보를 가져오는 용도로만 사용한다.
            // firebase signin 함수를 여기서 쓸수 있나?, admin에서는 제공하지 않는다.
            // 로그아웃처리는 어떻게?
        }catch(err){
          console.log(err)
        }
      })
      .catch((error) => {
        console.error(error);
      });
    })
    
}
));

// 로그아웃
router.get('logout', expressAsyncHandler(async (req, res) => {
  code = req.query.code;
  state = req.query.state;
  api_url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`  
}))

  module.exports = router



        //   const callbackURL = 'http://192.168.0.172:8081' // http://192.168.200.17:8081
      //   console.log(responseData?.response)
      //   // const queryText = responseData?.response?.email
      //  const querystring = responseData?.response
      //  console.log(querystring)
      //  res.redirect(`${callbackURL}?${JSON.stringify(querystring)}`);