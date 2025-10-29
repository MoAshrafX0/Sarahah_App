import nodemailer from "nodemailer";



export const sendEmail = async ({to, subject,cc="midol61526@icloud.com" ,contant,att=[]}) => {
  try {
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:process.env.USER_EMAIL  ,
            pass:process.env.USER_PASSWORD
        },
        tls:{
            rejectUnauthorized:false
        }

    })



const info = await transporter.sendMail({
    from:"Saraha-Team saraha.com",
    to,
    cc,
    subject,
    html:contant,
    attachments:att
    
})
    return info ;

} catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }}
import { EventEmitter } from "node:events";
 export const emitter = new EventEmitter();
emitter.on("sendEmail",  (args) => {
    sendEmail(args).then((res) => console.log("Email sent", res)).catch((err) => console.log("Error in sending email", err))
  
})
 