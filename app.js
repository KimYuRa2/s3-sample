
/*
 * Import required packages.
 * Packages should be installed with "npm install".
 */
const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require("multer-s3");
const path = require('path'); //설치X
const multer = require('multer');
const fs = require('fs'); // 설치 x

const router = express.Router();

// aws.config.loadFromPath(__dirname + "config/awsconfig.json");
// aws.config.loadFromPath('./config/awsconfig.json');

//# 환경변수 관리 ( "dotenv"사용 : 어떤 os에서 개발하더라도 , 동일하게 환경변수를 등록하고 가져올 수 있게됨.)
const dotenv = require("dotenv");
// # 환경변수 관리
dotenv.config(); //config(현재디렉토리의 .env파일을 자동으로 인식하여 환경변수 세팅)라는 메서드를 실행하면, dotenv라는 모듈이 자동적으로 .env에 등록돼있는 변수들을 node.js에서 접근할 수 있도록  "process.env.환경변수"에 등록을 시켜줌!!
console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);
console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);

/*
 * Set-up and run the Express app.
 */
const app = express();
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
const port = process.env.PORT ||3000; 
app.listen( port, () =>{
  console.log(`express 실행 http://localhost:${port}`); 
})

let s3 = new aws.S3();

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "heynature",
    key: function (req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension)
    },
    acl: 'public-read-write',
  })
})


app.post('/upload', upload.single("imgFile"), function(req, res, next){
  let imgFile = req.file;
  res.json(imgFile);
})

app.get('/upload', function(req, res, next) {
  res.render('upload.html');
});



// //* aws region 및 자격증명 설정
// /* https://velog.io/@gbskang/Heroku%EC%97%90%EC%84%9C-AWS-S3-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0  */
// aws.config.update({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   region: 'ap-northeast-2',
// });

// const upload = multer({
//   storage: multerS3({
//     s3: new aws.S3(),
//     bucket: 'heynature',
//     key(req, file, cb) {
//       cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
//       //original이란 폴더를 만들고 그 곳에 넣는 것
//     },
//   }),
//   limits: { fileSize: 20 * 1024 * 1024 },
// });
