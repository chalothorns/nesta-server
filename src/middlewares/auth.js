import jwt from "jsonwebtoken";

export const authAdmin = async (req, res, next) => {
    let token = req.cookies.accessToken;

    if(!token){
        return res.status(401).json({
            error: true,
            code: "NO_TOKEN",
            message: "Access denied. No token.",
        });
    }

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        //พอ decode เสร็จถึงจะเหน id user แล้วก็เอามาเก็บใน decoded_token 
        req.userId = decoded_token.userId;
        next();
        } catch (error) {
        next(error);
    }
};