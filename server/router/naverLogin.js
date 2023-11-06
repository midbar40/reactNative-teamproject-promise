const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const config = require('../config.js')

router.get('/', expressAsyncHandler(async (req, res) => {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + config.NAVER_CLIENT_ID + '&redirect_uri=' + config.NAVER_REDIRECT_URI + '&state=' + false;
  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
}))

router.get('/callback', function (req, res) {
    code = req.query.code;
    state = req.query.state;
    api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.NAVER_CLIENT_ID}`
    var request = require('request');
    var options = {
        url: api_url,
        method: post,
        headers: {'X-Naver-Client-Id':config.NAVER_CLIENT_ID, 'X-Naver-Client-Secret': config.NAVER_CLIENT_SECRET}
     };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.end(body);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });

  module.exports = router