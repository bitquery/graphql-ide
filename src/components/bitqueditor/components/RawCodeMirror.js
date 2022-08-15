import React, { Component } from 'react'

export default class JsonWidget extends Component {
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
		require('codemirror/mode/powershell/powershell')
		require('codemirror/mode/dart/dart')
		require('codemirror/mode/go/go')
		require('codemirror/mode/javascript/javascript')
		require('codemirror/mode/python/python')
		require('codemirror/mode/r/r')
		require('codemirror/mode/ruby/ruby')
		require('codemirror/mode/swift/swift')
		require('codemirror/keymap/sublime');

		this.viewer = CodeMirror(this._node, {
			lineWrapping: true,
			value: this.props.value || '',
			readOnly: true,
			mode: this.props.mode,
			keyMap: 'sublime',
			
		});
	}

	async componentDidUpdate(prevProps) {
		if (this.viewer) {
			if (this.props.mode !== prevProps.mode) {
				this.viewer.setOption('mode', this.props.mode)
			}
			if (this.props.value !== prevProps.value) {
				this.viewer.setValue(this.props.value || '')
			}
		}
	} 

	componentWillUnmount() {
		this.viewer = null;
	}

	render() {
		return (
			<section
				className="rawcode"
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

