import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'graphiql/graphiql.css'
import { ToastProvider } from 'react-toast-notifications'
import axios from 'axios'
if (process.env.NODE_ENV==='production') {
	let url = document.getElementById('graphql_ide').getAttribute('baseurl')
	axios.defaults.baseURL = url
}

ReactDOM.render(
	<ToastProvider autoDismiss={true} >
		<App/>
	</ToastProvider>,
	document.getElementById('graphql_ide')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
