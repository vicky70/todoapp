const jwt = require('jsonwebtoken');

module.exports = async function(req,res, next){
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({
            msg:"No token, authorization denied"
        });
    }
    else{
        try{

            await jwt.verify(token, process.env.jwtUsersecure,(err, decoded)=>{
                if(err){
                    res.status(401).json({
                        msg:"Token not valid"
                    });
                }
                else{
                    console.log(decoded.user);
                    req.user = decoded.user;
                    next();
                }
            });
        }catch(err){
            console.log("Something went wrong: " + err);
    
            res.status(500).json({
                msg:"Server error"
            });
        }
    }
}