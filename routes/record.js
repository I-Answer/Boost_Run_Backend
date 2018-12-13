const express = require('express');

const Record = require('../models').Record;
const User = require('../models').User;
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
    const users = await User.findOne({
        where: {nick: req.body.nick}
    });
        if(users) {
            try{
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

module.exports = router;