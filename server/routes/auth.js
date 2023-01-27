const app = require("express");
const router = app();
const User = require("../models/USER");
const Crypto = require("crypto-js");
const jwt = require("jsonwebtoken")

router.post("/register", async(req,res)=>{
    
    const newUser = new User ({
        username : req.body.username,
        email : req.body.email,
        //hash created with something mixing with the .env file
        password:Crypto.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC,
        ).toString()//to change the hashed password to the "" string thing before sending to the database

    });
    try{const savedUser = await newUser.save();
     
    res.status(201).json(savedUser)
    }
    catch(err){
        res.status(500).json(err);
    }
});

router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({
            username : req.body.username
        })
        
        
        !user && res.status(401).json("wrong Username")
        const hashedPassword = Crypto.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const originalpassword= hashedPassword.toString(Crypto.enc.Utf8);//enc.utf8 to repesent the unicode text in webpages
        const inputPassword=  req.body.password;
        
        originalpassword != inputPassword &&
        res.status(401).json("wrong password")

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin : user.isAdmin,

        },
        process.env.JWT_SEC,
        {   
        expiresIn:"3d" 
        },
    );
        
        const {password, ...others } = user._doc;
        res.status(200).json({...others, accessToken})//({others, accessToken})if you do this then the value comes in the console section with 2 sepeare object containing one thing till the end of _doc by the others object and another session id by the session Id object so for to make the output in a single object use this tecnique
    }catch(err){
        res.status(500).json(err);
    }
});



















module.exports = router;