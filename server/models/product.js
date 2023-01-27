const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    title : {
        type:String,
        required: true,
        unique:true,

    },
    disc:{
        type:String,
        require:true,
    },
    img:{
        type:String,
        require:true,

    },
    categories:{
        type:Array,
    },
    size:{
        type:String,
    },
    color:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    }
},
{
    timestamps:true,
});

module.exports  = mongoose.model("product",ProductSchema)