import React, { Component } from 'react';

class JsonWidget extends Component {
	viewer= null
	_node= null

	componentDidMount() {
		const CodeMirror = require('codemirror');
		require('codemirror/addon/fold/foldgutter');
		require('codemirror/addon/fold/brace-fold');
		require('codemirror/addon/dialog/dialog');
		require('codemirror/addon/search/search');
		require('codemirror/addon/search/searchcursor');
		require('codemirror/addon/search/jump-to-line');
		require('codemirror/keymap/sublime');
		require('codemirror-graphql/results/mode');

		this.viewer = CodeMirror(this._node, {
			lineWrapping: true,
			value: this.formatResult() || '',
			readOnly: true,
			theme: 'graphiql',
			mode: 'graphql-results',
			keyMap: 'sublime',
			foldGutter: {
				minFoldSize: 4,
			},
			gutters: ['CodeMirror-foldgutter'],
		});
	}

	shouldComponentUpdate(nextProps) {
		return this.props.dataSource !== nextProps.dataSource;
	}

	componentDidUpdate() {
	if (this.viewer) {
			const value = this.formatResult()
			this.viewer.setValue(value || '')
		}
	}

	componentWillUnmount() {
		this.viewer = null;
	}

	formatResult() {
		return this.props.dataSource.error 
			? `${JSON.stringify({[this.props.dataSource.displayed_data]: this.props.dataSource.values}, null, 2)},
			${JSON.stringify(this.props.dataSource.error, null, 2)}`
			: JSON.stringify({[this.props.dataSource.displayed_data]: this.props.dataSource.values}, null, 2)
	}

	render() {
		return (
			<section
			className="result-window"
			aria-label="Result Window"
			aria-live="polite"
			aria-atomic="true"
			ref={node => {
				this._node = node;
			}}
			/>
		);
	}
}

class JsonPlugin {
	constructor() {
		this.id = 'json.widget'
		this.name = 'JSON'
		this.editor = () => (<div className="widget"/>)
		this.renderer = JsonWidget
	}
	supportsModel(model) {
		for (let key in model) {
			return !key.includes('.') 
				|| (model[key].selectionSet?.selections.length > 1 && 
					model[key].typeInfo.toString().includes('['))
		}
	}
} 

export default new JsonPlugin()
