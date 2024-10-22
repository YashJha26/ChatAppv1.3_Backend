import jwt from 'jsonwebtoken';
const authMiddleware = async (req,res,next) =>{
    const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and follows the Bearer scheme
    if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extract the token part
    }
    console.log("Middleware token",token);
    let verifiedToken;
    try {
        if(token){
            verifiedToken= await jwt.verify(token,process.env.JWT_SECRET_KEY);
            if(!verifiedToken){
                res.json({message:"No token / token expired "}).redirect(process.env.CLIENT_AUTH_URL);
            }
            req.user = verifiedToken;
            next();
        }else{
            res.json({message:"No token / token expired "});
        }
    } catch (error) {
        res.json({message:"No token / token expired "});
        next(error)
    }
}

export default authMiddleware;
