const express = require('express');
const router = express.Router();
const config = require('../config.js')
const qs = require("qs");
const session = require('express-session');
const cors = require('cors');
const axios = require("axios");

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
            param: param ,
            headers: header
        })
    } catch (err) {
        rtn = err.response;
    }    
    console.log('인가코드 (서버41번줄): ', rtn)
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
    // res.status(302).res.json(rtn?.access_token)
    // res.status(302).redirect('/profile');
})

// router.get('/profile', async function (req, res) {
//     const uri = api_host + "/v2/user/me";
//     const param = {};
//     const header = {
//         'content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Bearer ' + req.session.key
//     }
//     var rtn = await call('POST', uri, param, header);
//     res.json(rtn);
//     // console.log(' 유저정보(서버52번줄) : ',rtn)
// })

// router.get('/friends', async function (req, res) {
//     const uri = api_host + "/v1/api/talk/friends";
//     const param = null;
//     const header = {
//         'Authorization': 'Bearer ' + req.session.key
//     }
//     var rtn = await call('GET', uri, param, header);
//     res.send(rtn);
// })

// router.get('/message', async function (req, res) {
//     const uri = api_host + "/v2/api/talk/memo/default/send";
//     const param = qs.stringify({
//         "template_object": '{'+
//                 '"object_type": "text",'+
//                 '"text": "텍스트 영역입니다. 최대 200자 표시 가능합니다.",'+
//                 '"link": {'+
//                 '    "web_url": "https://developers.kakao.com",'+
//                 '    "mobile_web_url": "https://developers.kakao.com"'+
//                 '},'+
//                 '"button_title": "바로 확인"'+
//             '}'
//         });
//     const header = {
//         'content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Bearer ' + req.session.key
//     }
//     var rtn = await call('POST', uri, param, header);
//     res.send(rtn);
// })



  module.exports = router