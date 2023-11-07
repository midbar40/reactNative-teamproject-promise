const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const config = require('../config.js')

const client_id = config.NAVER_CLIENT_ID;
const client_secret = config.NAVER_CLIENT_SECRET;
const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const redirectURI = encodeURI(`${config.NAVER_REDIRECT_URI}`);

router.get('/', expressAsyncHandler(async (req, res) => {

  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  res.json({API_URL : api_url})
  
  router.get('/callback', expressAsyncHandler(async (req, res) => {
    console.log("로그인버튼 클릭: ",req.query)
    code = req.query.code;
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' // 지금 이게 넘어오지 않는거 같다 
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(body)
        // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        // res.end(body);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  }));

}))

// router.get('/token', expressAsyncHandler(async (req, res) => {
//   tokenUri = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' 
//   + client_id + '&client_secret=' + client_secret + '&code=' + code + '&state=' + state;
//   res.json({tokenUri: tokenUri})
// }))


  module.exports = router