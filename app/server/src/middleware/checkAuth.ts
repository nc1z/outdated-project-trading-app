import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";

export const checkAuth = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
        // Get token from request header
        let token = req.header("authorization");

        // If token doesn't exist, then return unauthorized status and message
        if(!token) {
            return res.status(403).json({
                errors: [
                    {
                        msg: "unauthorized",
                    },
                ],
            });
        };

        // Get the JWT part of the Bearer String

        token = token.split(" ")[1];

        // Verify the JWT (Providing the secret key to validate), if there's an error, it means unauthorized
        try {
            const user = await JWT.verify(
                token,
                process.env.JWT_SECRET as string
            ) as { email: string };

            req.user = user.email;
            next();
        } catch(error) {
            return res.status(403).json({
                errors: [
                    {
                        msg: "unauthorized",
                    },
                ],
            });
        }
    };