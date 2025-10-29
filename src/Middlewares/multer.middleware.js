//=====================================> Multer Middleware <=======================================
import multer from "multer";
import fs from "node:fs";
import { allowedFileTypes, filterTypes } from "../common/constans/filter.constans.js";
const checkFolder = (folderPath)=>{
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath, {recursive: true});
    }
}
// local upload
export const localUpload = ({folderPath})=>{
  
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
         const fileDir = `uploads/${folderPath}`;
         checkFolder(fileDir);
        cb(null, fileDir)
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + file.originalname)
    }  
})

const fileFilter =(req,file,cb)=>{
   const fileKey = file.mimetype.split('/')[0].toUpperCase();
   const fileType=filterTypes[fileKey];
   if(!fileType){
    return cb(new Error('Invalid file type'));
   }
   const fileExtension = file.mimetype.split('/')[1];
   if(!allowedFileTypes[fileType].includes(fileExtension)){
    return cb(new Error('Invalid file extension'));
   }
   return cb(null, true);
}
    return multer({storage, fileFilter});
}

// Host upload
export const cloudinaryUpload = ()=>{
const storage = multer.diskStorage({
   
})

const fileFilter =(req,file,cb)=>{
   const fileKey = file.mimetype.split('/')[0].toUpperCase();
   const fileType=filterTypes[fileKey];
   if(!fileType){
    return cb(new Error('Invalid file type'));
   }
   const fileExtension = file.mimetype.split('/')[1];
   if(!allowedFileTypes[fileType].includes(fileExtension)){
    return cb(new Error('Invalid file extension'));
   }
   return cb(null, true);
}
    return multer({storage, fileFilter});
}
