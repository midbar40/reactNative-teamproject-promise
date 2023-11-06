const express = require('express');

const app = express();
const port = 5300;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({extended:true})) // true: qs, false: querystring

// 라우터 설정
const naverLoginRouter = require('./router/naverLogin');
const firebaseLoginRouter = require('./router/firebaseLogin');

// 라우터 적용
app.use('/naverlogin', naverLoginRouter);
app.use('/firebaseLogin', firebaseLoginRouter);



// 에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('서버 오류 발생!');
})

app.use((req, res, next) => {
  res.status(404).send('해당 경로를 찾을 수 없습니다!')
})

app.get('/error', (req, res, next) => {
  throw new Error('서버에 문제가 발생했습니다!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});