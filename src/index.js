import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import * as serviceWorker from './serviceWorker'
import './editor.css'

import { ToastProvider } from 'react-toast-notifications'
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
	<ToastProvider autoDismiss={true} >
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</ToastProvider>,
	document.getElementById('graphql_ide')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
