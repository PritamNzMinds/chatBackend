import jwt from "jsonwebtoken";
import { sendError } from "../helper/response.js";

export const auth=async(req,res,next)=>{
  const token =
  req.body?.token ||
  req.query?.token ||
  req.headers["x-access-token"]||
  req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return sendError(res,"Token is required for access this page",null,401);
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
  } catch (error) {
    return sendError(res,"Invalid token",error,401);
  }
  return next();
}