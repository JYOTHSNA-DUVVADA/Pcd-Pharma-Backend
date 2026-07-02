import mongoose from "mongoose";

const therapySchema = new mongoose.Schema(
{
    icon:{
        type:String,
        required:true
    },

    therapy:{
        type:String,
        required:true,
        unique:true
    },

    shortName:{
        type:String,
        required:true
    },

    slug:{
        type:String,
        required:true,
        unique:true
    },

    description:{
        type:String,
        default:""
    },

    presences:{
        type:Number,
        default:0
    },

    usedIn:{
        type:String,
        default:""
    },

    status:{
        type:String,
        default:"Active"
    }
},
{
    timestamps:true
});

export default mongoose.model("Therapy",therapySchema);