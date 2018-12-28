const express = require('express');

const User = require('../models').User;
const cors = require('cors');

const router = express.Router();

router.use(cors());

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