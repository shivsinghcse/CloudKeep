



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

# Day-37 Middleware
- in node.js Middleware is a function which execute betweeen req and res
- why we use 
	- to modify req (in req object there are multiple properties and methods like method, url, body, params) before goto controller (controller finally gives the response), here req=endpoint, res=controller
	- to secure req
- eg:
```js
app.get('/api/product', demo, getProduct)
// '/api/product' --> req
// demo is middleware here
// getProduct --> res
```
- endpoint(API) == route (UI)
- route/router level middleware
- app level middleware `app.use(demo) it applies on entire app



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