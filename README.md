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

To automate deploy create `shipitfile.js` :
```javascript
module.exports = shipit => {
	require('shipit-deploy')(shipit);
	require('shipit-shared')(shipit)

	shipit.initConfig({
		default: {
			workspace: '/home/USERNAME/WORKSPACE_FOLDER',
			deployTo: '/home/USERNAME/FOLDER_TO_DEPLOY',
			repositoryUrl: 'https://git-provider.tld/YOUR_GIT_USERNAME/YOUR_GIT_REPO_NAME.git',
			keepReleases: 3,
			key: 'PATH_TO_KEY(if needed)',
			branch: 'BRANCH_NAME',
			shared: {
				overwrite: true,
				dirs: ['node_modules']
			},
			shallowClone: true
		},
		production: {
			servers: 'USERNAME@YOUR_APP_SERVER_IP'
		}
	});
	const path = require('path')
	const envPath = path.join(
		shipit.config.deployTo+'/current',
		'.env'
	)
	shipit.on('updated', () => {
		shipit.start('npm-install')
	})
	shipit.on('published', () => {
		shipit.start('setup-env', 'build')
	})
	shipit.on('deployed', () => {
		shipit.start('run-server')
	})
	shipit.blTask('run-server', async () => {
		await shipit.remote(`cd ${shipit.releasePath} && sudo service ide restart`)
	})
	shipit.blTask('npm-install', async () => {
		await shipit.remote(`cd ${shipit.releasePath} && npm install --production`)
	})
	shipit.blTask('setup-env', async () => {
		await shipit.copyToRemote('.env.production', envPath)
	})
	shipit.blTask('build', async () => {
		await shipit.remote(`cd ${shipit.releasePath} && npm run buildns`)
	})
};
```
1. Setup `.env.production`  
	If app is not hosted at the server root, specify the `homepage` in `package.json`, f.e.
	```json
	"homepage": "http://mywebsite.com/relativepath",
	```
	or add `PUBLIC_URL` variable to `.env.production`  
2. Update your repository  
3. Run `npx shipit production deploy`  

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
