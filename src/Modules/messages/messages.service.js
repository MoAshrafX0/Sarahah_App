
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

// make private message 
export const makePrivateMessage = async (req,res)=>{
  const {id} = req.params
  const message = await Messages.findById(id)
  if(!message){
    return res.status(404).json({message:"Message Not found"})
  }
  message.isPublic = false
  await message.save()
  return res.status(200).json({message:"Message Made Private Successfully"})
}
// get private message 
export const getPrivateMessage = async (req,res)=>{
  const messages = await Messages.find({isPublic:false}).populate([
    {
      path:"receiverdId", 
      select:"firstName lastName"
    }  ])

    res.status(200).json({messages})
    
}
// make public message 
export const makePublicMessage = async (req,res)=>{
  const {id} = req.params
  const message = await Messages.findById(id)
  if(!message){
    return res.status(404).json({message:"Message Not found"})
  }
  message.isPublic = true
  await message.save()
  return res.status(200).json({message:"Message Made Public Successfully"})
}

// Get all public message 
export const getAllPublicMessage = async (req,res)=>{
  const messages = await Messages.find().populate([
    {
      path:"receiverdId", 
      select:"firstName lastName"
    }  ])

    res.status(200).json({messages})
    
}
// Get All  Message For Login User
export const getAllMessageUser = async (req,res) =>{
  const {user:{_id}}=req.loggedInUesr
   const messages = await Messages.find({receiverdId:_id}).populate([
    {
      path:"receiverdId", 
      select:"firstName lastName"
    }  ])
    res.status(200).json({messages})

}
// delete message 
export const deleteMessage = async (req,res)=>{
  const {id} = req.params
  const message = await Messages.findByIdAndDelete(id)
  if(!message){
    return res.status(404).json({message:"Message Not found"})
  }
  return res.status(200).json({message:"Message Deleted Successfully"})
}
