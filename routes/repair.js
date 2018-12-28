const express = require('express');

const User = require('../models').User;
const cors = require('cors');

const router = express.Router();

router.use(cors());

router.get('/select/ship/:nick', async (req, res, next)=>{
    try {
        const user = await User.findOne({
            where: {nick : req.params.nick}
        });
        if (user) {
            console.log(`${req.params.nick}님은 현재 ${user.curship}번 우주선을 선택중입니다`);
            res.json({"user":[{
                success: 1,
                curship: user.curship
                }]});
        } else {
            console.log('닉네임에 해당하는 유저를 찾는 것에 실패하였습니다');
            res.json({"user":[{
                success: 0,
                curship: null
                }]})
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.post('/select/ship', async (req, res, next)=>{
    try {
        const user = await User.findOne({
            where : {nick: req.body.nick}
        });
        if(user) {
            console.log(`${req.body.nick}님이 ${req.body.curship}번 우주선을 선택하였습니다`);
            await user.update({curship : req.body.curship}, {where: {nick : req.body.nick}});
            res.json({"user":[{
                success: 1,
                    curship: req.body.curship
                }]})
        } else {
            console.log('닉네임에 해당하는 유저를 찾을 수 없습니다');
            res.json({"user":[{
                success: 0,
                    curship: null
                }]})
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;