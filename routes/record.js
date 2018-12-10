const express = require('express');

const Record = require('../models').Record;
const User = require('../models').User;

const router = express.Router();

router.post('/', (req, res, next)=>{
    User.findOne({
        where: {nick: req.body.nick}
    })
        .then((result)=>{
            console.log('cannot found match user');
            res.json({
                status: 404,
                message: 'cannot found match user'
            })
        });
    Record.create({
        speed: req.body.speed,
        time: req.body.time,
        nick: req.body.nick,
    })
        .then((result)=>{
            res.json(result);
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        })
});

module.exports = router;