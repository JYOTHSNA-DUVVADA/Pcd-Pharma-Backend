import mongoose from "mongoose";

const presenceSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    state:{
        type:String,
        required:true
    },

    region:{
        type:String,
        required:true
    },

    partners:{
        type:Number,
        default:0
    },

    therapies:[
        {
            type:String
        }
    ],

    isHq:{
        type:Boolean,
        default:false
    },

    status:{
        type:String,
        default:"Active"
    }
},
{
    timestamps:true
});

export default mongoose.model("Presence",presenceSchema);