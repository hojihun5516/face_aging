require('dotenv').config()
const express = require('express')
const app = express()

const AWS = require('aws-sdk');
const router = require('./routes');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region : 'ap-northeast-2'
})
app.use('/',router)
app.use(cors('*'))

app.use((req, res, next) => {
    const err = new Error('Not Found Request URL');
    err.statusCode = 404;
    next(err);
});
  
app.use((err, req, res, next) => {
    const error = err;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    logger.error(error.message);
    res.status(error.statusCode).json({
      errMessage: error.message,
      success: false,
    });
});
app.listen(4000,()=>{
    console.log("server is running on 4000 port")
})