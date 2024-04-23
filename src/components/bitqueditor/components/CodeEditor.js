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
		require('codemirror/addon/display/autorefresh');
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
			autoRefresh: true,
			lineWrapping: true,
			value: this.formatResult(),
			readOnly: true,
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
			if (JSON.stringify(prevProps.values) !== JSON.stringify(this.props.values)) {
				const value = this.formatResult()
				this.viewer.setValue(value)
				if (value) {
					const ll = this.viewer.lastLine()
					for (let i = 0; i < ll; i++) {
						const l = this.viewer.getLine(i)
						if (l.startsWith('function') || l.startsWith('class') || l.startsWith('async')) {
							this.viewer.foldCode(i)
						}
					}
				}
			}
		}
	}

	componentWillUnmount() {
		this.viewer = null;
		clearInterval(this.interval)
	}

	formatResult() {
		try {
			let result = ''
			if (Array.isArray(this.props.values)) {
				for (let i=0; i<this.props.values.length-1; i++) {
					for (let functionName in this.props.values[i]) {
						window[functionName] = eval(`(${this.props.values[i][functionName]})`.replace('600px', '100%'))
						result += window[functionName].toString() + '\n'
					}
				}
				const Widget = `${this.props.values.at(-1)[Object.keys(this.props.values.at(-1))[0]]}`
				this.props.setWidget(Widget)
				result += Widget.toString()
			}
			return result
		}catch (error){
			console.log('error in code editor', error)
		}

	}

	render() {
		return (
			<div className={'flex-col flex w-100 overflow-auto' + (this.props.pluginIndex === 0 ? ' flexone' : '')} >
				<section
					className="result-window result-window-json result-window-active"
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
