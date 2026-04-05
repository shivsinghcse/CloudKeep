



# Day-31 
- if you are sending file via form Content-Type: multipart/form-data to follow this content-type js provide a class FormDat() if send anythigh using this it will go as multipart/form-data      


# Day-32
- routing 
- Page based routing in this we have to give relative path, it is not scalable
- if ui and api both serving from node than use identifire for endpoint or routing
- fileSend, relate path, absolute path
- route vs endpoint
- monolithic archi.  : ui ,model, controller, api
- template engine

# Day-33
- form => file + input follow Content-Type: multipart/form-data
- create instance of formDate()
- how to count percentage of uploading file
- query mutation - live update

# Day-35
- nodemailer : used for sending mails used in smaleer range app only max 10k/month 
- 50k/month mail, purchase smtp servers provided by many companies like sendgrid, msg91, mailchimp
- more than 50k/month use AWS SES (can use only pvt. ltd, llc)
- SMTP

# Day-38 protecting API
- any service which req api after login we make it private(protected)
- fetch
- upload
- delete
- download
- share
- whenever you call a function as a middleware function will receive req, res, next by default
- we will send token when do api request
- API request -->  we send payload
	- so there are two ways to send payload
		1. body (ordinary data )
		2. headers (confidential/secure data like token, api key, password, secret_key)
- for the auth related token header provide a key called `Authorization`
- goto headers select `Authorization` as a key and value
- whenever we send token from authorization we have to tell the type of token which is `Bearer tokenvalue`
- To protect api
	1. Firstly check authorization key is received or not
    2. check token type is Bearer or not
    3. validate token with sceret_key
    4. inject user payload in req object
    5. forward the req to controller
```js
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
```
- jwt.verify is synchronous


# Day-41 AWS
- AWS (Amazon web services)
- we generally deploy node.js project on cloud
- to deploy node.js website we need VPS (virtual private server : jiska admin aur root user aap he honge)
- aws has lots of services for different tasks for vps we will use ec2

1. ports allow - 80(http), 443(https), 22(ssh) -> security group
2. instance (cpu) setup
3. Login using putty
	username - ubuntu

4. Update dependency
	sudo apt update

5. Install nginx
	sudo apt install nginx

6. How to allow permission
	sudo chown ubuntu /var/www/html

7. Get free ssl
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ersaurav.com -d www.ersaurav.com
sudo certbot renew --dry-run1. ports allow - 80(http), 443(https), 22(ssh) -> security group
2. instance setup
3. Login using putty
	username - ubuntu

4. Update dependency
	sudo apt update

5. Install nginx
	sudo apt install nginx

6. How to allow permission
	sudo chown ubuntu /var/www/html

7. Get free ssl
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ersaurav.com -d www.ersaurav.com
sudo certbot renew --dry-run