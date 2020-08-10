const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs'); 
const path = require('path');
const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "bigdata-cgan", // 버킷 이름
        contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
        acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
        key: (req, file, cb) => {
            console.log(file);
            cb(null, new Date().valueOf() + file.originalname)
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});
/// 실제 사용할 함수
router.post('/api_v1/cgan', upload.single('img'), (req, res) => {
    try {
        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 
        let url = [
                    'https://bigdata-cgan.s3.ap-northeast-2.amazonaws.com/1.jfif',
                    'https://bigdata-cgan.s3.ap-northeast-2.amazonaws.com/2.jfif',
                    'https://bigdata-cgan.s3.ap-northeast-2.amazonaws.com/3.jfif',
                    'https://bigdata-cgan.s3.ap-northeast-2.amazonaws.com/4.jfif',
                    'https://bigdata-cgan.s3.ap-northeast-2.amazonaws.com/5.jfif',
                    'https://bigdata-cgan.s3.ap-northeast-2.amazonaws.com/6.jfif'
                ];
        res.status(200).json({url});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
///테스트용 사진업로드
router.post('/api_v1/test/cgan', upload.single('img'), (req, res) => {
    try {
        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 
        const payLoad = { url: req.file.location };
        res.status(200).json(payLoad);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;