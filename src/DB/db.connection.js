  // ============================> db Connection <====================================
import mongoose from "mongoose";
const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL_local)
     console.log('DB connected successfully');  
  } catch (error) {
console.log('Error in DB connection', error.message);
  
  }

}
export default dbconnection;