const express = require('express');
const router = express.Router();
const config = require('../config.js')
const qs = require("qs");
const session = require('express-session');
const cors = require('cors');
const axios = require("axios");
const { listAllUsers,  signUpUserwithNaverKakao  } = require('./firebaseLogin.js')

const client_id = config.KAKAO_CLIENT_ID
const redirect_uri = config.KAKAO_REDIRECT_URI
const token_uri = 'https://kauth.kakao.com/oauth/token';
const api_host = "https://kapi.kakao.com";

router.use(session({
    secret: 'kakao session secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
let corsOptions = {
    origin: '*',
    credentials: true
}
router.use(cors(corsOptions));

async function call(method, uri, param, header){
    try {
        rtn = await axios({
            method: method,
            url: uri,
            data: param ,
            headers: header
        })
    } catch (err) {
        rtn = err.response;
    }    
    return rtn?.data;
}

router.get('/', function (req, res) {
    res.status(302).redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`)
})


router.get('/redirect', async function (req, res) {
    console.log('코드 :',req.query.code)
    const param = qs.stringify({
        "grant_type": 'authorization_code',
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "code": req.query.code
    });
    
    const header = { 'content-type': 'application/x-www-form-urlencoded' };
    var rtn = await call('POST', token_uri, param, header);
    req.session.key = rtn?.access_token;
    console.log('토큰값 (서버56번줄): ', rtn)
    res.status(302).redirect('/profile');
})

router.get('/profile', async function (req, res) {
    const uri = api_host + "/v2/user/me";
    const param = {};
    const header = {
        'content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + req.session.key
    }
    var rtn = await call('POST', uri, param, header);
    req.session.kakaoUser = { email: rtn.id + '@kakao.com', password: rtn.id + 'secret', name: rtn.properties.nickname, token: req.session.key }
    console.log(' 유저정보(서버71번줄) : ',rtn)

    const userInfo = await listAllUsers() // Firebase에 등록된 유저 정보
    const userEmail = userInfo.map((user) => { return user.email }) // Firebase에 등록된 유저 이메일만 추출
    
    if(userEmail.includes(req.session.kakaoUser.email)){ // firebase에 이미 등록된 유저인지 확인
      console.log('이미 가입된 유저입니다')
    }
    else {
      await signUpUserwithNaverKakao(req.session.kakaoUser.email, req.session.kakaoUser.password, req.session.kakaoUser.name) // firebase auth / db에 유저 정보 등록 
      console.log('회원가입 완료')
    }
  

    return res.json(req.session.kakaoUser);
})

router.get('/logout', function (req, res) {
    req.session.destroy();
    axios({
        method: 'POST',
        url: "https://kapi.kakao.com/v1/user/logout",
        headers: { 'Authorization': 'Bearer ' + req.session.key }
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    })
    res.status(302).send('로그아웃 되었습니다');
})
  module.exports = router