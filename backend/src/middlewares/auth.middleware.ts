import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken"


export const authMiddleware = async(req : Request , res :Response, next: NextFunction)=>{
    const token = req.headers["authorization"] ?? ""

    const decoded = jwt.verify(token, JWT_SECRET as string )

    if((decoded as JwtPayload).userId){

        // @ts-ignore
        req.userId = decoded.userId
        next()
        
    }else{

        res.status(403).json({
          message : "Unauthorized user"
        })  
    }
}