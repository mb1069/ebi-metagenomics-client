[![Build Status](https://travis-ci.org/EBI-Metagenomics/ebi-metagenomics-client.svg?branch=master)](https://travis-ci.org/EBI-Metagenomics/ebi-metagenomics-client)

 # ebi-metagenomics-client
#### Requirements:
 - npm >= 5.3.0
 - nginx
 
#### How To Install Nginx on Ubuntu 14.04 LTS?

```
sudo apt-get update
sudo apt-get install nginx

sudo service nginx start
sudo service nginx stop
```

#### How to configure Nginx on Ubuntu 14.04?

```
sudo nano /etc/nginx/nginx.conf
//Add server details and project distribution (dist dir) location

sudo service nginx restart
```


#### How to install NodeJs including npm on Debian and Ubuntu based Linux distributions?
https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

#### How to setup your project?
 Run 'npm install' in the project's main directory.
 Serve with own server, or use biult-in dev system by calling 'webpack-dev-server' in main directory.
 Access locally run server on http://localhost:8080/index.html .
