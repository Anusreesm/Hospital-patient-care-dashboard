// middlewares/authorize.js
import jwt from "jsonwebtoken"
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import userModel from "../models/User.js";
import { errorResponse } from "../constants/response.js";


export const authMiddleware = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // No token found
    if (!token) {
      return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.AUTH.NO_TOKEN);
    }
    // Validate token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    } catch (error) {
      return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_TOKEN);
    }
    // Fetch user from DB
    const user = await userModel.findById(decoded.id).select("-password");
    
    if (!user) {
      return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.AUTH.USER_NOT_FOUND);
    }
    req.user = user;
    next();
  }
  catch (error) {
    console.error("Auth Middleware Error:", error);
    return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
  }
};

// ---------------------------
// ONLY ADMIN ACCESS MIDDLEWARE
// ---------------------------
export const authAdmin = async (req, res, next) => {
   try {
      if (req?.user?.role === "admin") {
        return next();
      }

      return errorResponse(
        res,
        STATUS.UNAUTHORIZED,
        MESSAGES.AUTH.UNAUTHORIZED_ADMIN
      );
    } catch (error) {
      console.error("Admin Middleware Error:", error);
      return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
  };


  export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
      }
      next();
    } catch (error) {
      return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
  };
};
