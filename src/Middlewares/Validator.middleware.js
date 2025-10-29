// ============================> validatorMiddleware <====================================
  const reqKeys=["body","params","query"]
  export const validatorMiddleware=(schema)=>{
    return (req,res,next)=>{
        const validateError=[]

        for(const key of reqKeys){
            if(schema[key]){
             const error =schema[key].validate(req[key],{abortEarly:false})       
             if(error.error){
                validateError.push({key,...error.error.details})
             }

             
            }
        }
        if(validateError.length>0){
            return res.status(400).json({message:"Validation Error",validateError})
        }
        next()
    }
  }