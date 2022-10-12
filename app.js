/*
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/


/*
 * Import required packages.
 * Packages should be installed with "npm install".
 */
const express = require('express');
const aws = require('aws-sdk');
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
/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */
aws.config.region = 'ap-northeast-2';

/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

/*
 * Respond to GET requests to /account.
 * Upon request, render the 'account.html' web page in views/ directory.
 */
app.get('/account', (req, res) => res.render('account.html'));

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
app.post('/save-details', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify("Request Success"));
});

