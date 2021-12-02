import React, { Component } from 'react'

class JsonWidget extends Component {
	viewer= null
	_node= null

	async componentDidMount() {
		const CodeMirror = require('codemirror');
		require('codemirror/addon/fold/foldgutter');
		require('codemirror/addon/fold/brace-fold');
		require('codemirror/addon/dialog/dialog');
		require('codemirror/addon/search/search');
		require('codemirror/addon/search/searchcursor');
		require('codemirror/addon/search/jump-to-line');
		require('codemirror/mode/htmlmixed/htmlmixed')
		require('codemirror/keymap/sublime');
		require('codemirror-graphql/results/mode');
		let value = this.props.mode === 'code' && await this.props.getCode()

		this.viewer = CodeMirror(this._node, {
			lineWrapping: true,
			value: value || this.formatResult() || '',
			readOnly: true,
			theme: 'graphiql',
			mode: this.props.mode !== 'json' ? 'htmlmixed' : 'graphql-results',
			keyMap: 'sublime',
			foldGutter: {
				minFoldSize: 4,
			},
			gutters: ['CodeMirror-foldgutter'],
		});
	}

	shouldComponentUpdate(nextProps) {
		return this.props.dataSource !== nextProps.dataSource || this.props.mode !== nextProps.mode;
	}

	async componentDidUpdate(prevProps) {
		if (this.viewer) {
			const value = this.props.mode === 'code' ? await this.props.getCode() : this.formatResult()
			const mode = this.props.mode === 'code' ? 'htmlmixed' : 'graphql-results'
			this.viewer.setValue(value || '')
			this.viewer.setOption('mode', mode)
		}
	}

	componentWillUnmount() {
		this.viewer = null;
	}

	formatResult() {
		return JSON.stringify({
			[this.props.dataSource.displayed_data]: this.props.dataSource.values}, 
			null, 2
		)}

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
