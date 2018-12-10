const express = require('express');

const Record = require('../models').Record;
const User = require('../models').User;

const router = express.Router();

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

module.exports = router;