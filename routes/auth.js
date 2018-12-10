const express = require('express');

const User = require('../models').User;

const router = express.Router();

// 루트 라우터
router.post('/user', async (req, res, next)=>{
    const user = await User.findOne({
        where: {nick: req.body.nick}
    })
        if(user){
        console.log(user);
         res.json({
                status: 409,
                message: 'duplicate nickname error'
            });
        }
        else{
            await User.create({
                id: req.body.id,
                password: req.body.password,
                nick: req.body.nick,
            })
                .then((result)=>{
                    console.log(result);
                    res.json(result).status(201);
                })
        }
});

module.exports = router;