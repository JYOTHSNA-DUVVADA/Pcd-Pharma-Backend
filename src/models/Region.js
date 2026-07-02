const regionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },

    description:{
        type:String
    },

    status:{
        type:String,
        default:"Active"
    }

},
{
timestamps:true
});
export default mongoose.model("Region" , regionSchema);