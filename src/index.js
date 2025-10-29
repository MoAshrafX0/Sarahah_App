import "dotenv/config";
import express from "express";
const app = express();
import dbconnection from "./DB/db.connection.js";
import messageController from "./Modules/messages/messages.controller.js";
import cors from "cors";
import helmet from "helmet";
import{ rateLimit , ipKeyGenerator} from "express-rate-limit";
import MongoStore from "rate-limit-mongo";
import axios from "axios";
import userController from "./Modules/user/Controllers/user.controller.js";
import authController from "./Modules/user/Controllers/auth.controller.js";

//=============================> basic middlewares <====================================

app.use(express.json());
app.use("/uploads",express.static("uploads"))
// ==================================> helmet middleware <====================================

app.use(helmet());
//================================================================================

// ============================> ratelimiter middleware call <====================================

// Get country code
async function getCountryCode(ip){
  const response = await axios.get(`https://ipapi.co/${ip}/country/`);
   
  return response.data;
} 
 
//   const rateLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
    
//     max:async function(req){
//       const {countryCode} = await getCountryCode(req.header("x-forwarded-for"));
//       if(countryCode === "IN") return 20;
//       if(countryCode === "US") return 10;
//       if(countryCode === "EG") return 50
//       return 5;
       
//     },
//     requestPropertyName: "ratelimiter",
//     statusCode: 429,
//     handler: (req, res, next) => {
//       if(req.ratelimiter){
//         res.status(429).json({
//           message: "Too many requests from this IP, please try again later",
//         });
//       }else{
//         next()
//       }

//     },
//     keyGenerator: (req) => {
//       const ip = ipKeyGenerator(req.header("x-forwarded-for")); 
//       return `${ip}-${req.path}`;
//     },
//     store: new MongoStore({
//       uri: process.env.DB_URL_local,
//       collectionName: 'rateLimiter',
//       expireTimeMs: 30 * 60 * 1000,
//     })
     
//   });

// app.use(rateLimiter)
// rate limiter middleware test
                                            

//=============================> cors middleware <====================================

const whitelist = process.env.WHITE_LISTED_ORIGINS;
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {


      callback(new Error('Not allowed by CORS'))
    }
  }
}

//=============================> cors middleware call <====================================
app.use(cors(corsOptions));

//================================================================================
//=============================> route middlewares <====================================
app.use("/api/auth", authController);
app.use("/api/users", userController);
app.use("/api/messages", messageController);
//==========================================================================
//=============================> connect to database <====================================
dbconnection();

//==========================================================================
//=============================> error handling middleware <====================================
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  if (req.session && req.session.inTransaction()) {
    // abort Transaction
    await req.session.abortTransaction();
    //  end session
    req.session.endSession();
    console.log("the Transaction is abort");
  }
  res.status(500).send({ message: err.message });
});

//=============================> route not found middleware <====================================

app.use((req, res, next) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running at http://localhost:${process.env.PORT}`)
);
