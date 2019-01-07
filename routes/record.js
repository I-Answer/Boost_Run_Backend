const express = require('express');
const Record = require('../models').Record;
const User = require('../models').User;
const {Sequelize: { Op }} = require('../models');
const cors = require('cors');

const router = express.Router();

router.use(cors());

router.get('/:nick',async (req, res, next)=>{
   try{
       const user = await User.findOne({
           where: {nick: req.params.nick}
       });
       if(user) {
           res.json({"user":[{
                   maxSpeed: user.maxSpeed,
                   maxTime: user.maxTime,
               }]
           })
       } else{
           console.log('cannot found match user');
           res.json({
               status: 404,
               message: 'cannot found match user'
           })
       }
   } catch (err) {
       console.error(err);
       next(err);
   }
});

router.post('/', async (req, res, next)=>{
    let x = Number(req.body.time);
    let y = Number(req.body.speed);
    x = (Math.pow((0.0001 * x),2)) + (0.0708 * x) + 2;
    if(y < 1800) y =0;
    if(y >= 1800) y-=1800;
    y = (Math.pow((0.00002* y),2)) + (0.003 * y) + 2;
    let sp = Math.floor(x + y);
    const users = await User.findOne({
        where: {nick: req.body.nick}
    });
        if(users) {
            try{
                sp = sp + users.sp;
                const user = await Record.create({
                    speed: req.body.speed,
                    time: req.body.time,
                    nick: req.body.nick,
                });
                if(users.maxSpeed < req.body.speed) {
                    User.update({
                        maxSpeed: req.body.speed,
                    }, {
                        where: {nick: users.nick}
                    })
                }
                if(users.maxTime < req.body.time) {
                    User.update({
                        maxTime: req.body.time,
                    }, {
                        where: {nick: users.nick}
                    })
                }
                User.update({
                    sp: sp,
                }, {
                    where: {nick: users.nick}
                });

                res.json({"user":[{
                        "id":user.id,
                        "speed":user.speed,
                        "time":user.time,
                        "nick":user.nick,
                        "createdAt":user.createdAt
                    }]});
            } catch (err) {
                console.error(err);
                next(err);
            }
        } else {
            console.log('cannot found match user');
            res.json({
                status: 404,
                message: 'cannot found match user'
            })
        }
});

router.get('/rank/speed', async (req, res, next)=>{
    try{
        const users = await User.findAll({
            attributes: ['id','nick','maxSpeed'],
            order: [['maxSpeed','DESC']],
            limit: 10,
        });
        res.json({"user":users});
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/rank/time', async (req, res, next)=>{
    try{
        const users = await User.findAll({
            attributes: ['id','nick','maxTime'],
            order: [['maxTime','DESC']],
            limit: 10,
        });
        res.json({"user":users});
    } catch(err) {
        console.log(err);
        next(err);
    }
});

router.get('/rank/speed/:nick', async (req, res, next)=>{
    try {
        const user = await User.findOne({
            where: {nick : req.params.nick}
        });
        if(user)
        {
            console.log(`유저의 maxSpeed 는 ${user.maxSpeed} 입니다`);
            User.findAll({
                attributes: ['nick'],
                where: {maxSpeed: { [Op.gt] : user.maxSpeed }}
            })
                .then((others)=>{
                    console.log(`유저의 순위는 ${others.length + 1}위 입니다`);
                    res.json({"user":[{
                            "success":1,
                            "rank":others.length+1,
                            "nick": req.params.nick,
                            "maxSpeed":user.maxSpeed
                        }]})
                })
        } else {
            console.log('nick에 해당하는 유저가 존재하지 않습니다');
            res.json({"user":[{
                "success":0,
                    "rank":null,
                    "nick":null,
                    "maxSpeed":null
                }]})
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/rank/time/:nick', async (req, res, next)=>{
    try {
        const user = await User.findOne({
            where: {nick : req.params.nick}
        });
        if(user)
        {
            console.log(`유저의 maxTime 은 ${user.maxTime} 입니다`);
            User.findAll({
                attributes: ['nick'],
                where: {maxTime: { [Op.gt] : user.maxTime }}
            })
                .then((others)=>{
                    console.log(`유저의 순위는 ${others.length + 1}위 입니다`);
                    res.json({"user":[{
                            "success":1,
                            "rank":others.length+1,
                            "nick": req.params.nick,
                            "maxTime":user.maxTime
                        }]})
                })
        } else {
            console.log('nick에 해당하는 유저가 존재하지 않습니다');
            res.json({"user":[{
                    "success":0,
                    "rank":null,
                    "nick":null,
                    "maxTime":null
                }]})
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;