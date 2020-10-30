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

### environment variables

SMTP_HOST=<br />
SMTP_PORT=<br />
SMTP_USER=<br />
SMTP_PASS=<br />
DEFAULT_EMAIL=<br />
DB_HOST=<br />
DB_USER=<br />
DB_PASSWORD=<br />
DB_PORT=<br />
NODE_ENV= production || development

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
