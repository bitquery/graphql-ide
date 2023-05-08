import React, { Component } from 'react'

class CodeEditor extends Component {
	viewer= null
	_node= null
	ref = React.createRef()
	interval

	state = {
		time: 0
	}

	async componentDidMount() {
		const CodeMirror = require('codemirror');
		require('codemirror/addon/fold/foldgutter');
		require('codemirror/addon/fold/foldcode');
		require('codemirror/addon/fold/brace-fold');
		require('codemirror/addon/dialog/dialog');
		require('codemirror/addon/search/search');
		require('codemirror/addon/search/searchcursor');
		require('codemirror/addon/search/jump-to-line');
		require('codemirror/mode/htmlmixed/htmlmixed')
		require('codemirror/keymap/sublime');
		require('codemirror-graphql/results/mode');

		this.viewer = CodeMirror(this._node, {
			lineWrapping: true,
			value: this.props.values,
			readOnly: true,
			scrollbarStyle: null,
			theme: 'graphiql',
			mode: 'javascript',
			keyMap: 'sublime',
			foldGutter: {
				minFoldSize: 4,
			},
			gutters: ['CodeMirror-foldgutter']
		});
		this.ref.current = this.ref.current ? this.ref.current : this.props.dateAdded
		if (this.props.values && this.props.wsClean) {
			this.interval = setInterval(() => this.setState({time: this.ref.current ? Math.floor((new Date().getTime() - this.ref.current)/1000) : 0}), 1000)
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.values !== nextProps.values || this.props.dataSource !== nextProps.dataSource || this.props.mode !== nextProps.mode || this.state.time !== nextState.time || this.props.wsClean !== nextProps.wsClean;
	}

	async componentDidUpdate(prevProps) {
		if (this.viewer) {
			if (!this.props.wsClean && this.interval) {
				clearInterval(this.interval)
			}
			if (JSON.stringify(prevProps.values) !== JSON.stringify(this.props.values)) {
				const value = this.props.mode === 'code' ? await this.props.getCode() : this.formatResult()
				this.viewer.setValue(value || '')
				if (value) {
					const ll = this.viewer.lastLine()
					for (let i = 0; i < ll; i++) {
						const l = this.viewer.getLine(i)
						if (l.startsWith('function') || l.startsWith('class') || l.startsWith('async')) {
							this.viewer.foldCode(i)
						}
					}
				}
			} else if (prevProps.dataSource.values !== this.props.dataSource.values) {
				const value = this.props.mode === 'code' ? await this.props.getCode() : this.formatResult()
				this.viewer.setValue(value || '')
			}
		}
	}

	componentWillUnmount() {
		this.viewer = null;
		clearInterval(this.interval)
	}

	formatResult() {
		return this.props.values
	}

	render() {
		return (
			<div className={'flex-col flex w-100 overflow-auto' + (this.props.pluginIndex === 0 ? ' flexone' : '')} >
				<section
					className="result-window"
					aria-label="Result Window"
					aria-live="polite"
					aria-atomic="true"
					ref={node => {
						this._node = node;
					}}
				/>
			</div>
		);
	}
}

class CodePlugin {
	constructor() {
		this.id = 'json.widget'
		this.name = 'JSON'
		this.editor = () => (<div className="widget"/>)
		this.renderer = CodeEditor
	}
	supportsModel(model) {
		for (let key in model) {
			return !key.includes('.') 
				|| (model[key].selectionSet?.selections.length > 1 && 
					model[key].typeInfo.toString().includes('['))
		}
	}
} 

export default new CodePlugin()
