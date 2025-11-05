let jwt = require("jsonwebtoken");

exports.VerifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;  
    // so sometimes in some system Authorization is used in capital and in some small

    if (authHeader && authHeader.startsWith("Bearer"))  
    // check where it is authHeader and it starts with Bearer or not 
    {
        token = authHeader.split(" ")[1];   
        // now it is been split like [Bearer][eysdg]-token 

        if (!token)       
        // if token is not then 
        {
            return res.status(401).json({ message: `NO token` });
        }

        try {   
            // if there is token then 
            let decode = jwt.verify(token, process.env.SECRET_KEY); 
            // jwt.verify function used to verify token and process.env in env file we have given the key 
            
            req.user = decode;   
            // if token is valid then it gives payload id, role 
            // console.log("the decode is :", req.user);
            // console.log("The decoded token payload is:", req.user);
            
            next();
        } catch (err) {
            console.error("Token verification failed:", err);
            return res.status(401).json({ message: "Token is invalid or expired" });    
        }
    } else {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }
}
