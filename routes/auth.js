const express = require('express');

const User = require('../models').User;

const router = express.Router();

// 루트 라우터
router.post('/user', (req, res, next)=>{
    User.findOne({
        where: {nick: req.body.nick}
    })
        .then((result) => {
        console.log('duplicate nickname error');
        res.json({
            status: 409,
            message: 'duplicate nickname error'
        })});
    User.create({
        id: req.body.id,
        password: req.body.password,
        nick: req.body.nick,
    })
        .then((result)=>{
            console.log(result);
            res.json(result).status(201);
        })
});

module.exports = router;