const express = require('express');

const User = require('../models').User;

const router = express.Router();

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

module.exports = router;