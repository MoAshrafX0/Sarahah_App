//      =================================> encryption.util <====================================

import cypto from 'node:crypto';
import fs from 'node:fs';
const ivLength = +process.env.IV_LENGTH
export const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY);

 export const encrypt = (text) => {
     const iv = cypto.randomBytes(ivLength);
    const cipher = cypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY,iv);
    let encrypted =cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}` ;
 }
    export const decrypt = (encryptedData) => {
        const [ iv , encryptedText]= encryptedData.split(":");
        
        const decipher = cypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv,'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;

    }


// ============================> Generate RSA key pair if not already present <====================================
if (fs.existsSync('publicKey.pem') && fs.existsSync('privateKey.pem')) {
    console.log('Keys already exist. Skipping key generation.');
}
// ============================> Generate new keys <====================================
else {
    const {publicKey,privateKey}= cypto.generateKeyPairSync('rsa',{
        modulusLength:2084,
        publicKeyEncoding:{ 
            type:'pkcs1',
            format:'pem'
        },
        privateKeyEncoding:{
            type:'pkcs1',
            format:'pem'
              }     
        
    })
     fs.writeFileSync('publicKey.pem',publicKey);
    fs.writeFileSync('privateKey.pem',privateKey);
}
export const asyncEncrypt = (text) => {
    const publicKey = fs.readFileSync('publicKey.pem','utf8');
    const bufferdText = Buffer.from(text);
    const  data = cypto.publicEncrypt({
        key:publicKey,
        padding:cypto.constants.RSA_PKCS1_OAEP_PADDING,
    },bufferdText);
    return data.toString('hex');
}
export const asyncDecrypt = (encryptedText) => {
    const privateKey = fs.readFileSync('privateKey.pem','utf8');
    const bufferText = Buffer.from(encryptedText,'hex');
    const data = cypto.privateDecrypt({
        key:privateKey,
        padding:cypto.constants.RSA_PKCS1_OAEP_PADDING,
    },bufferText);
    return data.toString('utf8');
}
        
    
