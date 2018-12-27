const express = require('express');

const User = require('../models').User;
const cors = require('cors');

const router = express.Router();
router.use(cors());

// 루트 라우터
router.post('/user', async (req, res, next)=>{
    const user = await User.findOne({
        where: {nick: req.body.nick}
    });
        if(user){
        console.log(user);
         res.json({"user":[{
                 "shiplist": null,
                 "curship": null,
                 "sp": null,
                 "id": null,
                 "password": null,
                 "nick": null
             }]
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
                    res.json({"user":[result]}).status(201);
                })
        }
});

router.get('/user/:nick', async (req, res, next)=>{
    try{
        const user = await User.findOne({
            where: {nick: req.params.nick}
        });
        if(user) {
            res.json({"user":[user]});
        }
        else{
            res.json({
                "user":[
                    {
                        "id": null,
                        "password": null,
                        "nick":  null,
                        "shiplist": null,
                        "curship": null,
                        "sp": null,
                        "maxSpeed": null,
                        "maxTime": null
                    }
                ]
            })
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;