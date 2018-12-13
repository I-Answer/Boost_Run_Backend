const express = require('express');

const User = require('../models').User;
const cors = require('cors');

const router = express.Router();

router.use(cors());

// 루트 라우터
router.get('/allUser', (req, res, next)=>{
    User.findAll()
        .then((users)=> {
            res.json({
                "num":users.length,
                users
            });
        })
        .catch((err)=> {
            console.log(err);
            next(err);
        });
});

router.post('/bitflag', async (req, res, next)=>{
    try{
        const user = await User.findOne({
            where: {nick: req.body.nick}
        });
        if(user) {
            // noinspection JSAnnotator
            user.bitflag = Number(user.bitflag) + Number(req.body.bitflag);
            const result = User.update({
                bitflag: user.bitflag,
            }, {
                where: {nick:user.nick},
            });
            res.json({"user":[{
                    nick: user.nick,
                    bitflage: user.bitflag
                }]
            });
        }
        else {
            res.json({
                status: 404,
                message: 'cannot found match user'
            })
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;