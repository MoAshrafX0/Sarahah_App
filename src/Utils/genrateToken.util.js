import jwt from "jsonwebtoken";

// genrate Token
    export const genrateToken = (payload,secret,options)=>{
        return jwt.sign(payload,secret,options)
    }


  //  verify Token

  export const verfaiyToken =(payload,secret)=>{
 return jwt.verify(payload,secret)
  }
