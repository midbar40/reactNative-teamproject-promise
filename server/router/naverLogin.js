const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const config = require('../config.js')
const axios = require('axios')
const client_id = config.NAVER_CLIENT_ID;
const client_secret = config.NAVER_CLIENT_SECRET;
let state = 'abcde'

const redirectURI = encodeURI(`${config.NAVER_REDIRECT_URI}`);

router.get('/', expressAsyncHandler(async (req, res) => {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  res.json({API_URL : api_url})
  console.log("네이버 로그인 버튼 클릭: ",api_url) 
}))

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
      let token = responseJson.access_token
      let header = "Bearer " + token // Bearer 다음에 공백 추가

      return fetch('https://openapi.naver.com/v1/nid/me', {
        method: 'GET',
        headers: { 'Authorization': header }
      })
      .then((res) => res.json())
      .then((responseData) => {
        // console.log(responseData)
        // res.json(responseData)
        const callbackURL = 'http://192.168.200.17:8081'
        console.log(responseData?.response?.name)
        // const queryText = responseData?.response?.email
       const querystring = responseData?.response?.name
       console.log(querystring)
       res.redirect(`${callbackURL}?${JSON.stringify(querystring)}`);
      })
      .catch((error) => {
        console.error(error);
      });
    })
    
}
));

  module.exports = router