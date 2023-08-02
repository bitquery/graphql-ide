import React, { Component } from 'react'

class JsonWidget extends Component {
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
			autoRefresh: true,
			lineWrapping: true,
			value: value || this.formatResult(),
			readOnly: true,
			scrollbarStyle: null,
			theme: 'graphiql',
			mode: this.props.mode !== 'json' ? 'htmlmixed' : 'graphql-results',
			keyMap: 'sublime',
			foldGutter: {
				minFoldSize: 4,
			},
			gutters: ['CodeMirror-foldgutter'],
		});
		this.ref.current = this.ref.current ? this.ref.current : this.props.dateAdded
		if (this.props.values && this.props.wsClean) {
			this.interval = setInterval(() => this.setState({time: this.ref.current ? Math.floor((new Date().getTime() - this.ref.current)/1000) : 0}), 1000)
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.dataSource !== nextProps.dataSource || this.state.time !== nextState.time;
	}

	async componentDidUpdate(prevProps) {
		if (this.viewer) {
			const data = this.formatResult()
			this.viewer.setValue(data)
			/* if (!this.props.wsClean && this.interval) {
				clearInterval(this.interval)
			} */
			/* if (JSON.stringify(prevProps.values) !== JSON.stringify(this.props.values)
				|| prevProps.dataSource.values !== this.props.dataSource.values 
				|| this.props.loading !== prevProps.loading) {
				const value = this.props.mode === 'code' ? await this.props.getCode() : this.formatResult()
				this.viewer.setValue(value || '')
			} */
			/* if (this.props.mode !== prevProps.mode) {
				const mode = this.props.mode === 'code' ? 'htmlmixed' : 'graphql-results'
				this.viewer.setOption('mode', mode)
			} */
		}
	}

	componentWillUnmount() {
		this.viewer = null;
		clearInterval(this.interval)
	}

	formatResult() {
		return this.props.dataSource.getData 
			? JSON.stringify(this.props.dataSource.getData())
			: '' 
	}

	render() {
		return (
			<div className={'flex-col flex' + (this.props.pluginIndex === 0 ? ' flexone' : '')} >
				{this.props.values && <div className='result-time'>{this.state.time} seconds ago</div>}
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
