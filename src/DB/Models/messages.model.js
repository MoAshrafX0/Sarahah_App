import mongoose from "mongoose";

// ============================> messages model <====================================
const messageSchema =new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    receiverdId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    isPublic:{
        type:Boolean,
        default:false
    }

},
{
        timestamps:true
    }
)


const Messages =mongoose.model("Messages",messageSchema)
export default Messages