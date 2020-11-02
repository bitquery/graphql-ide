This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Right click on tab to get query link if it is already shared

## Available Scripts

In the project directory, you can run:

### `npm run createdb`

Create DB

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
Node server started at [http://localhost:4000](http://localhost:4000)

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production

### `npm run server`

Runs built app in production
NODE_ENV must be 'production'
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

###-------------------------------



## HTML

```
<head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/dracula.css" />
	<link href="https://cdn.jsdelivr.net/gh/bitquery/graphql-ide@latest/build/static/css/main.css" rel="stylesheet">
</head>
<body>
	<div id="graphql_ide" baseurl="backend_url_here"></div>
	<script src="https://cdn.jsdelivr.net/gh/bitquery/graphql-ide@latest/build/static/js/main.js"></script>
</body>
```

## Deployment

### NodeJS install

Install nodejs for example, following instructions on 
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04

```
sudo apt-get update
sudo apt-get install build-essential libssl-dev
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh

source ~/.profile

nvm install 14.15.0

node -v
v14.15.0

npm -v
6.14.8

```

### Build project

```
git clone https://github.com/bitquery/graphql-ide.git
cd graphql-ide/
npm install
```

### Configure environment variables

```
vim .env
```

edit file:

```
SMTP_HOST=<host of smtp server for sending confirmation emails>
SMTP_PORT=<port of smtp server for sending confirmation emails>
SMTP_USER=<user for smtp server for sending confirmation emails>
SMTP_PASS=<smptp user password>
DEFAULT_EMAIL=<Email sender field ( from ) >
DB_HOST=<mysql database host>
DB_USER=<mysql database user>
DB_PASSWORD=<mysql database password>
DB_PORT=<mysql database port, ususally 3306>
NODE_ENV=production
REACT_APP_ENDPOINT_URL=<default Graphql URL  endpoint>
IDE_URL=<URL of frontent app>
BACKEND_URL=<URL of backend app>
```

### Database setup

You will need to install mysql database server.
In Mysql command line:

```sql
CREATE USER 'ide'@'localhost' identified by '<PASSWORD>';
GRANT ALL privileges on `bitquery`.* to 'ide'@'%' identified by '<PASSWORD>' with grant option;
FLUSH privileges;
```

create database schema:

```
npm run createdb
```

### Run server
```
npm run server
```