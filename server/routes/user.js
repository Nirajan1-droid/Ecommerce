const app = require("express");
const router = app();
const User = require("../models/USER");
const { verifyToken,  verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
 
//posting the info to the user db
 router.put("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    
    if(req.body.password){
        req.body.password=Crypto.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();

    }

        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body,
            },
            {new:true});

            res.status(200).json(updatedUser);


        }catch(err){
            res.status(500).json(err)
        }
        
    }
 
 );

router.get('/',verifyTokenAndAdmin, async(req,res)=>{
    const query = req.query.new; //req.query.new is passed from the axios section 
    //this query.new is passed to the url section by the client 
    //by:const query = true;
    // axios.get(`/users?new=${query}`)
    try{
        const users = query ? await User.find().sort({_id:-1}).limit(5) //sort({_id:-1}) sorts the documents in decesinding order and limit(x) is the no of documents will be appeared after there ist he query implemented on the user 
        : await User.find();//if there is no query then it finds everything without sort and limitation 
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json(err)
    }
});


router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    //don't forget how theh verifyTokenAndAuthorization middleware is getting the pointer of the whole data row before actually getting the access, the token is verified and then only the req.user get the pointer of the login route object user
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get single user for the verification
router.get('/find/:id', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others);

    }catch(err){
        res.status(500).json(err);
    }
});
  



router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;