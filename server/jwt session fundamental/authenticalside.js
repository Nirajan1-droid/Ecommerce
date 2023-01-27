
router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({
            userName : req.body.username
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


        //from this section the token thing start , token is created by signing with the secret key and the expiry date
        //jwt token is signed using the HS256 algorithm
        const accessToken = jwt.sign({
            //first section is payload which refers to the information to be included in the jwt . such as id and additional claims
            id:user._id,
            isAdmin : user.isAdmin,

        },
        //second is the secret key
        process.env.JWT_SEC,
        {   //third is the expiry date, we can't set this to undefined indifinately
        expiresIn:"3d" 
        },
    )
        
        const {password, ...others } = user._doc;
        res.status(200).json({...others, accessToken})//({others, accessToken})if you do this then the value comes in the console section with 2 sepeare object containing one thing till the end of _doc by the others object and another session id by the session Id object so for to make the output in a single object use this tecnique
    }catch(err){
        res.status(500).json(err);
    }
});

