const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UserM = require('../model/ModelUser');
const jwt = require('../middleware/jwtUser');
const web = require('jsonwebtoken');

router.get('/', jwt, async (req, res, next)=>{
    try{
        const user = await UserM.findById(req.user.id).select('-password');
        console.log(user);
        res.status(200).json({
            success:true,
            user:user
        });

    }
    catch(error){
        console.log(err);
        res.status(500).json({
            success:false,
            msg:"Server Error! Please try some time leter"
        });
        next();
    }
});

router.post('/register',async (req, res, next)=>{
   const {username, email, password} = req.body;
   console.log(req.body);
   try{
        let user_exist = await UserM.findOne({email : email});
        console.log(`The value of userChecker is = ${user_exist}`);
        if(user_exist){
            res.json({
                success:false,
                msg:"user aleadry exists"
            });
        }
        else{
            let user = new UserM();
            user.username = username;
            user.email = email;
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);

            let size = 200;
            user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';
            await user.save();
            const payload = {
                user:{
                    id: user.id
                }
            }
            web.sign(payload, process.env.jwtUsersecure, {
                expiresIn: 360000
            }, (err, token)=>{
                if(err) throw err;
                res.status(200).json({
                    success: true,
                    token: token
                });
            });
        }
    }
    catch(err){
        console.log(err);
    }
});

router.post('/login', async(req, res, next)=> {
    const email = req.body.email;
    const password = req.body.password;
    try{
        let user = await UserM.findOne({
            email:email
        });
        if(!user){
            res.status(400).json({
                success: false,
                meg:'User not Exist! Please Register first.'
            });
        }else{

            const isMatch = await bcryptjs.compare(password, user.password);
            if(!isMatch){
                res.status(400).json({
                    success: false,
                    meg:'Invalid password'
                });
            }
            else{
                const payload = {
                    user:{
                        id: user.id
                    }
                }
                web.sign(payload, process.env.jwtUsersecure, {
                    expiresIn: 360000
                }, (err, token)=>{
                    if(err) throw err;
                    res.status(200).json({
                        success: true,
                        token: token,
                        user: user
                    });
                });

            }
        }
    }catch(err){
        console.log(err.message);
        res.status(401).json({
            success: false,
            meg:'server error'
        });
    }
});
module.exports = router;