
import jwt, { JwtPayload } from "jsonwebtoken";
import {Request, Response, NextFunction} from "express"
import { SECRET } from "@repo/common/config";

declare global {
    namespace Express {
         export interface Request {
            userId?: string,
            email?: string
    }
}
}

export function middleware(req: Request, res: Response, next: NextFunction ) {
    const auth = req.headers

    if (!auth || !auth.authorization) return res.status(401).json({
        message: "Unauthorized Header"
    })

    const token = auth.authorization?.split(" ")[1]

    if (!token) return res.status(401).json({
        message: "Unauthorized Header"
    })

    
    try {
        const decoded = jwt.verify(token, SECRET) as JwtPayload

        req.userId = decoded.userId
        req.email = decoded.email
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized Header"
        })
    }
}