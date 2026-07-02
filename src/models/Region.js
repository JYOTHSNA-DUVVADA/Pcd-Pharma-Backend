import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    description:{
        type:String
    },

    statesCount:{
        type:Number,
        default:0
    },

    presences:{
        type:Number,
        default:0
    },

    distributors:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        default:"Active"
    },

    statesList:[
        {
            type:String
        }
    ]
},
{
    timestamps:true
});

export default mongoose.model("Region" , regionSchema);