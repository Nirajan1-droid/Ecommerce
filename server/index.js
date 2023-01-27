const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');


app.use(express.json());

app.use(cors());



mongoose.connect(process.env.MONGO_URL).
then(()=>console.log("Db connection successful"))
.catch((err)=>console.log(err))


app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);



app.listen(process.env.PORT || 5000, ()=>{
    console.log("backend is running")
})