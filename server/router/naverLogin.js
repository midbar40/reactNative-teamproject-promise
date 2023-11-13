const express = require('express');
const expressAsyncHandler = require('express-async-handler');
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
 
   
   try {
    const response = await fetch(api_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    // console.log('토큰체크 :', json);

    const token = json.access_token;
    const header = "Bearer " + token;
    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET',
      headers: { 'Authorization': header }
    })
    const userData = await userResponse.json() // 네이버 로그인 시 받아온 유저 정보
    req.session.user = {email : userData.response.email, password: userData.response.id, name: userData.response.name}
    console.log('세션테스트(서버48줄) :', req.session.user)
    const userInfo = await listAllUsers() // Firebase에 등록된 유저 정보
    const userEmail = userInfo.map((user) => { return user.email }) // Firebase에 등록된 유저 이메일만 추출
    console.log('유저이메일(서버51줄) :', userEmail)
    if(userEmail.includes(userData.response.email)){ // firebase에 이미 등록된 유저인지 확인
      console.log('이미 가입된 유저입니다')
    }
    else {
      await signUpUser(userData.response.email, userData.response.id, userData.response.name) // firebase에 유저 등록, 이미 로그인한 상태에서 들어가야 등록이 되고, 최초 로그인시 등록이 되지 않는다.
      console.log('회원가입 :', userEmail)
      registerFirebaseDB(userData.response.id, userData.response.email, userData.response.name) // firestore(DB)에 유저 등록
    }
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('오류가 발생했습니다');
  }
}
));

// 유저정보
router.get('/user', expressAsyncHandler(async (req, res) => {
  res.json(req.session.user)
  console.log('유저정보(서버71줄) :', req.session.user)
}))


// 로그아웃
router.get('logout', expressAsyncHandler(async (req, res) => {
  code = req.query.code;
  state = req.query.state;
  api_url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`  
}))

  module.exports = router
