

 //=================================> Multer Filter <==================================

 export const filterTypes={
    IMAGE:  'image',
    VIDEO:  'video',
    AUDIO:  'audio',
    APPLICATION:  'application',
}
 
export const allowedFileTypes={
    [filterTypes.IMAGE]:['png','jpg','jpeg','gif','webp'],
    [filterTypes.VIDEO]:['mp4','avi','mkv','mov','wmv'],
    [filterTypes.AUDIO]:['mp3','wav','ogg','wma','aac'],
    [filterTypes.APPLICATION]:['pdf','doc','docx','xls','xlsx','ppt','pptx'],

    
}
