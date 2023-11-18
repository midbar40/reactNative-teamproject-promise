const dotenv = require('dotenv')

// process.env 객체에 삽입 .env 파일의 환경변수 주입
dotenv.config()

module.exports = {
    NAVER_CLIENT_ID : process.env.NAVER_CLIENT_ID ,
    NAVER_CLIENT_SECRET : process.env.NAVER_CLIENT_SECRET ,
    NAVER_REDIRECT_URI : process.env.NAVER_REDIRECT_URI,
    KAKAO_CLIENT_ID : process.env.KAKAO_CLIENT_ID,
    KAKAO_REDIRECT_URI : process.env.KAKAO_REDIRECT_URI,
}