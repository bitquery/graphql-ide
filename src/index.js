import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'graphiql/graphiql.css'
import { ToastProvider } from 'react-toast-notifications'
import axios from 'axios'
import { BrowserRouter, Route } from 'react-router-dom';
if (process.env.NODE_ENV==='production') {
	// let url = document.getElementById('graphql_ide').getAttribute('baseurl')
	axios.defaults.baseURL = process.env.REACT_APP_ENDPOINT_URL
}

ReactDOM.render(
	<ToastProvider autoDismiss={true} >
		<BrowserRouter>
			<Route path={`${process.env.REACT_APP_IDE_URL}`}>
				<App/>
			</Route>
		</BrowserRouter>
	</ToastProvider>,
	document.getElementById('graphql_ide')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
