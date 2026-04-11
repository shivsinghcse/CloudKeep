



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


# Day-41 aws static deployment with ec2 route53 and ssl
- AWS (Amazon web services)
- we generally deploy node.js project on cloud
- to deploy node.js website we need `VPS` (virtual private server : jiska admin aur root user aap he honge)
- aws has lots of services for different tasks for `vps` we will use `ec2` (it is a hardware to process code)

- choose data center - mumbai, india if your user are mainly from india or nearest countries

1. when we took vps so 1st on that vps we allow some ports : ports allow - 80(http), 443(https) [http and https to allow request response in browser (so user can access website)], 22(ssh) -> security group[to install any software in our vps(cpu) like filezilla and putty]
    - security group naming: appname-sg
    - description: Allow ssh http https
    - inbound rule add : type --> ssh, http, https source-type--> anywhere IPv4 (but in ssh my IP this is dynamic)

2. instance (cpu) setup
    - name: webappname
    - OS:
        - .net -> windows
        - robotics --> mac
        - for other --> linux (ubntu for medium range and debian for enterprise) 
        - create key pair is a type of security key which helps to login in server to install server. name: appname-ssh-key,  format: .ppk and save it somewhere
        - select security group
        - configure storage (harddisk) max we take 20GB which is huge for code
        - launch instance
        - next we have to create server this cpu
            - nginx, nodejs, tomcat, apache

3. Login using putty
	username - ubuntu

4. Update dependency
	- `sudo apt update`
    - sudo means root user
    - apt is dependency management tool like linux like npm


5. Install nginx
	sudo apt install nginx

6. How to allow permission
	sudo chown ubuntu /var/www/html

- to connect the domain we use Route53 service (it is a dns management service) it connect hosting to domain
    - search route53
    - goto hosted zone
    - domainname --> create
    - connect dns
    - create recorde
        - A record
        - CNAME record for redirect
7. Get free ssl
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ersaurav.com -d www.ersaurav.com (it will expire after 3 months to renew)
sudo certbot renew --dry-run


shivsinghcse@gmail.com
Teratera@13

# Day-42 NodeJS aws deploy
- ec2 (elastic compute cloud)
- route53 - dns management
- security group -> it used to allow port (80, 443, 22 - for static website)
- filezilla and putty establish connection through ssh
- ec2 is free (upto 700 hrs free) but security group and route53 are not free
- for code we use use ec2 and for binary files use s3

- inbound rule means rule of request
### deploy nodejs website on ec2
1. allow ports using security group
2. setup vps using ec3
 
