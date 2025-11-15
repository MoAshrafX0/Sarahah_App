import{ rateLimit , ipKeyGenerator} from "express-rate-limit";
import MongoStore from "rate-limit-mongo";
import { getCountryCode } from "../Utils/countryIp.utils";

 
  const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    
    max:async function(req){
      const {countryCode} = await getCountryCode(req.header("x-forwarded-for"));
      if(countryCode === "IN") return 20;
      if(countryCode === "US") return 10;
      if(countryCode === "EG") return 50
      return 5;
       
    },
    requestPropertyName: "ratelimiter",
    statusCode: 429,
    handler: (req, res, next) => {
      if(req.ratelimiter){
        res.status(429).json({
          message: "Too many requests from this IP, please try again later",
        });
      }else{
        next()
      }

    },
    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req.header("x-forwarded-for")); 
      return `${ip}-${req.path}`;
    },
    store: new MongoStore({
      uri: process.env.DB_URL_local,
      collectionName: 'rateLimiter',
      expireTimeMs: 30 * 60 * 1000,
    })
     
  });


  export default rateLimiter