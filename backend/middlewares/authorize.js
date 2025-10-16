// middlewares/authorize.js
import jwt from "jsonwebtoken"
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"

// admin authentication middleware
export const authAdmin= async (req,res,next)=>{
  try{
    const {adminToken} =req.headers
    if(!adminToken)
    {
      return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);

    }
    // decode token
    const token_decode= jwt.verify(adminToken,process.env.SECRET_KEY || "secret123")
  }
  catch(error)
  {
  return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.USER.SERVICE_ERROR)
  }
}