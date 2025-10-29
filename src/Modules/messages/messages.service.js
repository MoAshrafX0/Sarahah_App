
import Messages from "../../DB/Models/messages.model.js"

// send Messages Services

import User from "../../DB/Models/user.model.js"

export const sendMessages =  async (req,res)=>{
  const {content} =req.body
  const {receiverdId}=req.params

  const user = await User.findById(receiverdId)
  if(!user){
    return res.status(404).json({message:"User Not found"})
  }
  const message =new Messages({
    content,
    receiverdId
  })
  await message.save()
  return res.status(200).json({
    message:"Message Sent Successfully",
    message
  })

}

// Get Message
export const getMessage= async (req,res)=>{
  const messages= await Messages.find().populate([
{
  path:"receiverdId", 
  select:"firstName lastName"
}  ])

res.status(200).json({messages})
 
}