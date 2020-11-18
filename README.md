### Bitquery Editor


With [**Bitquery Editor**](https://graphql.bitquery.io/), we are changing the way how developers work with blockchains data.

Using our Bitquery editor, developers can create GraphQL queries to use them as APIs. You can also share queries with anyone; for example, check this [GraphQL query](https://explorer.bitquery.io/graphql/NPrY9TzCX1) for the top 10 DEX trades based on USD amount.

Developers will able to save their queries and share them with team members or publicly. And use them directly in their applications as APIs. In addition, we are building ‘Flexigraph,’ which will allow developers to expand our schema by joining multiple queries and other techniques.

We also plan to enable visualization through drag and drop charts building using the query results, helping analysts and data scientists visualizing blockchain data.

Our editor and queries will be powered by Bitquery Infra, where we currently process more than 160 TB of blockchain data.

Bitquery editor is [open-source](https://github.com/bitquery/graphql-ide), and we plan to make it a universal GUI tool for working with blockchain data for developers, analysts, and data scientists.

![](https://cdn-images-1.medium.com/max/1080/1*gPZPb8Mu8gzGcmUVQORxfQ.png)



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Right click on tab to get query link if it is already shared

## [](https://github.com/bitquery/graphql-ide#available-scripts)Available Scripts

In the project directory, you can run:

### [](https://github.com/bitquery/graphql-ide#npm-run-createdb)`npm run createdb`

Create DB

### [](https://github.com/bitquery/graphql-ide#npm-run-dev)`npm run dev`

Runs the app in the development mode.  

Open [http://localhost:3000](http://localhost:3000/) to view it in the browser. Node server started at [http://localhost:4000](http://localhost:4000/)

The page will reload if you make edits.  

You will also see any lint errors in the console.

### [](https://github.com/bitquery/graphql-ide#npm-run-build)`npm run build`

Builds the app for production

### [](https://github.com/bitquery/graphql-ide#npm-run-server)`npm run server`

Runs built app in production NODE\_ENV must be 'production' Open [http://localhost:4000](http://localhost:4000/) to view it in the browser.

###-------------------------------

## [](https://github.com/bitquery/graphql-ide#html)HTML

    <head>

    	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/dracula.css" />

    	<link href="https://cdn.jsdelivr.net/gh/bitquery/graphql-ide@latest/build/static/css/main.css" rel="stylesheet">

    </head>

    <body>

    	<div id="graphql_ide" baseurl="backend_url_here"></div>

    	<script src="https://cdn.jsdelivr.net/gh/bitquery/graphql-ide@latest/build/static/js/main.js"></script>

    </body>

    

## [](https://github.com/bitquery/graphql-ide#deployment)Deployment

### [](https://github.com/bitquery/graphql-ide#nodejs-install)NodeJS install

Install nodejs for example, following instructions on [https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04)

    sudo apt-get update

    sudo apt-get install build-essential libssl-dev

    curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh

    

    source ~/.profile

    

    nvm install 14.15.0

    

    node -v

    v14.15.0

    

    npm -v

    6.14.8

    

    

### [](https://github.com/bitquery/graphql-ide#build-project)Build project

    git clone https://github.com/bitquery/graphql-ide.git

    cd graphql-ide/

    npm install

    

### [](https://github.com/bitquery/graphql-ide#configure-environment-variables)Configure environment variables

    vim .env

    

edit file:

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

    

### [](https://github.com/bitquery/graphql-ide#database-setup)Database setup

You will need to install mysql database server. In Mysql command line:

```sql

CREATE USER 'ide'@'localhost' identified by '<PASSWORD>';

GRANT ALL privileges on `bitquery`.* to 'ide'@'%' identified by '<PASSWORD>' with grant option;

FLUSH privileges;

```

create database schema:

    npm run createdb

    

### [](https://github.com/bitquery/graphql-ide#run-server)Run server

    npm run server

