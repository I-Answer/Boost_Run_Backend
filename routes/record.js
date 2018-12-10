const express = require('express');

const Record = require('../models').Record;
const User = require('../models').User;

const router = express.Router();

router.get('/:nick',async (req, res, next)=>{
   try{
       const user = await User.findOne({
           where: {nick: req.params.nick}
       });
       if(user) {
           res.json({
               maxSpeed: user.maxSpeed,
               maxTime: user.maxTime,
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
    const user = await User.findOne({
        where: {nick: req.body.nick}
    });
        if(user) {
            try{
                const result = await Record.create({
                    speed: req.body.speed,
                    time: req.body.time,
                    nick: req.body.nick,
                });
                if(user.maxSpeed < req.body.speed) {
                    User.update({
                        maxSpeed: req.body.speed,
                    }, {
                        where: {nick: user.nick}
                    })
                }
                if(user.maxTime < req.body.time) {
                    User.update({
                        maxTime: req.body.time,
                    }, {
                        where: {nick: user.nick}
                    })
                }
                res.json(result);
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
        res.json(users);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;