const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const config = require('../config.js')

const {signUpUser, listAllUsers, registerFirebaseDB, signUpUserwithNaverKakao  } = require('./firebaseLogin.js')
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
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'cache-control':'no-cache, must-revalidate, post-check=0, pre-check=0',
      },
    });
    const json = await response.json();
    console.log('토큰체크 :', json);
    
    const token = json.access_token;
    const header = "Bearer " + token;
    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Authorization': header,
      'cache-control':'no-cache, must-revalidate, post-check=0, pre-check=0',
    }
    })
    const userData = await userResponse.json() // 네이버 로그인 시 받아온 유저 정보
    req.session.user = {email : userData.response.email, password: userData.response.id, name: userData.response.name, token: token} 
    console.log('유저데이터(서버48줄) :', userData)
    // console.log('세션테스트(서버49줄) :', req.session.user)
    
    const userInfo = await listAllUsers() // Firebase에 등록된 유저 정보
    const userEmail = userInfo.map((user) => { return user.email }) // Firebase에 등록된 유저 이메일만 추출
    
    if(userEmail.includes(userData.response.email)){ // firebase에 이미 등록된 유저인지 확인
      console.log('이미 가입된 유저입니다')
    }
    else {
      await signUpUserwithNaverKakao(userData.response.email, userData.response.email + 'secret', userData.response.name) // firebase auth / db에 유저 정보 등록 
      console.log('회원가입 완료')
    }
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('오류가 발생했습니다');
  }
  return res.json(req.session.userData)
}
));

// 유저정보
router.get('/user', expressAsyncHandler(async (req, res) => {
  // console.log('유저정보(서버78줄) :', req.session.user)
  return res.json(req.session.user)
}))


// 네이버 로그아웃
router.get('/logout', expressAsyncHandler(async (req, res) => {
  req.session.destroy( )
  code = req.query.code;
  state = req.query.state;
  api_url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`  
  reLogin_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&state=${state}&redirect_uri=${api_url}&auth_type=reauthenticate`
  console.log("로그아웃 세션삭제(네이버): ",req.session)
  res.redirect(reLogin_url)
}))

  module.exports = router
