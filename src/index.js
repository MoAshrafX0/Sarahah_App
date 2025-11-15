import "dotenv/config";
import express from "express";
const app = express();
import dbconnection from "./DB/db.connection.js";
import messageController from "./Modules/messages/messages.controller.js";
import cors from "cors";
import helmet from "helmet";

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


app.use(rateLimiter)
                                            

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
