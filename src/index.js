import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App'
import * as serviceWorker from './serviceWorker'
import './editor.css'

import { BrowserRouter } from 'react-router-dom';
import { widget } from './charting_library'

window.TradingView = {widget}
const container = document.getElementById('graphql_ide');
const root = createRoot(container)
root.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
