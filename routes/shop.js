const express = require('express');

const User = require('../models').User;
const cors = require('cors');

const router = express.Router();

router.use(cors());

router.get('/sp/:nick', async(req, res, next)=>{
    try {
        const user = await User.findOne({
            where : {nick : req.params.nick}
        });
        if(user) {
            console.log(`${user.nick}님은 현재 ${user.sp} sp를 보유중입니다`);
            res.json({"user":[{
                success : 1,
                sp : user.sp
                }]})
        } else {
            console.log('닉네임에 해당하는 유저를 찾지 못했습니다');
            res.json({"user":[{
                success : 0,
                    sp : null
                }]})
        }
    } catch(error) {
        console.error(error);
        next(error)
    }
})

router.post('/buy/ship', async (req, res, next)=>{
    let tmp;
    try {
        const user = await User.findOne({
            where: {nick: req.body.nick}
        });
        if(user) {
            console.log(user.sp, 'number : ',Number(user.sp));
            tmp = Number(user.sp) - Number(req.body.price);
            console.log(`${user.nick}님이 ${user.sp}에서 ${req.body.price}만큼의 sp를 사용하려고 합니다.`);
            if(tmp < 0)
            {
                res.json({"user":[{
                    success : 0
                    }]})
            }
            else {
                User.update({sp: tmp},{ where: {nick: req.body.nick}});
                res.json({"user":[{
                        success : 1
                    }]});
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;