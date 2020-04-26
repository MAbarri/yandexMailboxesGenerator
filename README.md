# Yandex Mailboxes Generator

This project was built with MEAN Angular CLI 7,

## How to run the app?
- Run `npm install` to install required dependencies.
- Run `ng serve` to run the angular app
- Start the MEAN Stack backend
  - `cd backend` to enter into the backend folder
  - `nodemon server` to start the nodemon server
  - `mongod` to start the mongoDB shell

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Production Depoilement:
Prepare environement:
- install NODE JS
- install MongoDB
- install Angular Client
- install PM2 & NGINX for WEB Serving

one all done, make sure you have installed npm packages:
- in root folder: `npm install`
- in backend folder: `npm install`
build for production :
- run `npm build --prod`

Everything Done, with no problem ? great now NGINX Config and you all set:
- Update default config file in : /etc/nginx/sites-available, as below

```
server {
	root /var/www/html/yandexMailboxesGenerator/dist/mean-stack-crud-app;
	index index.html index.htm index.nginx-debian.html;
	server_name generatengine.online www.generatengine.online;
	location / {
		try_files $uri $uri/ /index.html;
	}
	location /backendapi {
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $http_host;
		proxy_set_header X-NginX-Proxy true;
		proxy_pass http://api_node_js;
		proxy_redirect off;
	}
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/generatengine.online/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/generatengine.online/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.generatengine.online) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    if ($host = generatengine.online) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
	listen 80 default_server;
	listen [::]:80 default_server;
	server_name generatengine.online www.generatengine.online;
    return 404; # managed by Certbot

}
```

don't forget to update the file to your configuration:
- set `/var/www/html/yandexMailboxesGenerator` to your project path
- set domain name to yours


That's it it's done and working !!
