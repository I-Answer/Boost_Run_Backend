let express = require('express');
const cors = require('cors');
let User = require('../models').User;
const { verify } = require('./middlewares');
let router = express.Router();
router.use(cors());

let jwt = require('jsonwebtoken');

// id, password 로 인증받아 토큰을 발급받는 API
router.post('/signIn', async (req, res)=> {
    let err = {};
    try {
        const user = await User.findOne({
            where: {id: req.body.id},
        });
        if (user) {
            // 비밀번호 일치 시
            if (req.body.password == user.password) {
                let token = sign(user);
                res.cookie("sign", token);
                res.json({
                    'status': 200,
                    'token': token,
                    user : user
                });
            }
            else {
                err.message = '비밀번호가 일치하지 않습니다';
                throw err;
            }
            function sign(user) {
                let token = jwt.sign({
                        // 토큰의 내용 (payload)
                        nickname: user.nickname,
                        intro: user.intro,
                        id: user.id
                    },
                    'entry_minibirds', // 비밀키
                    {
                        expiresIn: '5m' // 유효시간 5분
                    }
                );
                return token;
            }
        } else {
            err.message = '아이디에 해당하는 사용자가 없습니다';
            throw err;
        }
    } catch (err) {
        res.status(401);
        res.json({
            status: 401,
            message: err.message
        })
    }
});

// id, nickname, password 를 body 에서 받아와 새로운 유저를 등록하는 API
router.post('/signUp', async (req, res)=>{
    let err = {};
    try {
        const user = await User.findOne({
            where: {id: req.body.id}
        });
        if (user) {
            err.message = '아이디가 중복된 사용자가 존재합니다.';
            err.status = 405;
            throw err;
        } else {
            let result = await User.create({
                id: req.body.id,
                password: req.body.password,
                nickname: req.body.nickname
            });
            res.json({
                result
            })
        }
    } catch (err) {
        res.json({
            status: err.status,
            message: err.message
        })
    }
});

// 토큰이 발급되었고 유효한지 검사하는 API
router.get('/token', async (req, res)=>{
   let token = req.cookies.sign;
   let err = {};
   if(token) {
       try {
           let result = await verify(token, 'entry_minibirds');
           if(result < 0) throw err;
           res.json(result);
       } catch (err) {
               res.json({
                   status: 401,
                   message: err.message
               });
               // 401 , invalid signature (비인증된 토큰)
               // 401 , jwt expired (토큰 유효기간 만료)
       }
   } else {
       res.json({
           'status':404,
           'message':'JWT token 이 존재하지 않습니다'
       })
   }
});

module.exports = router;