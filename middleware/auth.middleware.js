const jwt = require('jsonwebtoken')


const AuthMiddleware = (req, res, next) => {
    
    try
    {
        const {authorization} = req.headers
        
        // 1. Check authorization header exists
        if(!authorization)
            return res.status(401).json({message: 'Invalid request'})
        
        const [type, token] = authorization.split(' ')

        // 2. Check token type is Bearer
        if('Bearer' !== type || !token)
            return res.status(401).json({message: 'Invalid request'})

        // 3. validate token - jwt.verify throws on failure, no need to null check
        const user = jwt.verify(token, process.env.JWT_SECRET)
        
        // 4. Inject user payload into req object
        req.user = user

        // 5. Forward to controller
        next()
    }
    catch(err){
        console.error(err);
        res.status(401).json({message: 'Invalid request'})
    }
}

module.exports = AuthMiddleware

/*
    1. Firstly check authorization key is received or not
    2. check token type is Bearer or not
    3. validate token with sceret_key
    4. inject user payload in req object
    5. forward the req to controller
*/