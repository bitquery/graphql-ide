import React, { Component } from 'react'
import 'codemirror/lib/codemirror.css'
import 'graphiql/graphiql.min.css'
import { height_of } from '../../../utils/common'

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

export default class QueryEditor extends Component {
	editor = null
	_node = null

	constructor(props) {
		super(props)
		this.hz = false
		this.state = {
			mouseDown : false
		}
	}

	onKeyUp = (cm, event) => {
		if (AUTO_COMPLETE_AFTER_KEY.test(event.key) && this.editor) {
		  this.editor.execCommand('autocomplete');
		}
	}
	_onEdit = () => {
		const value = this.editor.getValue()
		return this.props.onEdit(value)
	}

	componentDidMount() {
		const CodeMirror = require('codemirror');
		require('codemirror/addon/hint/show-hint');
		require('codemirror/addon/edit/matchbrackets');
		require('codemirror/addon/edit/closebrackets');
		require('codemirror/addon/fold/brace-fold');
		require('codemirror/addon/fold/foldgutter');
		require('codemirror/addon/lint/lint');
		require('codemirror/addon/search/searchcursor');
		require('codemirror/addon/search/jump-to-line');
		require('codemirror/addon/dialog/dialog');
		require('codemirror/keymap/sublime');
		require('codemirror-graphql/variables/hint');
		require('codemirror-graphql/variables/lint');
		require('codemirror-graphql/variables/mode');

		const editor = (this.editor = CodeMirror(this._node, {
			value: this.props.value || '',
			lineNumbers: true,
			tabSize: 2,
			mode: 'graphql-variables',
			theme: 'graphiql',
			keyMap: 'sublime',
			autoCloseBrackets: true,
			matchBrackets: true,
			showCursorWhenSelecting: true,
			readOnly: false,
			foldGutter: {
				minFoldSize: 4,
			},
			lint: {
				variableToType: this.props.variableToType,
			},
			hintOptions: {
				variableToType: this.props.variableToType,
				closeOnUnfocus: false,
				completeSingle: false,
				container: this._node,
			},
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
		}))
		if (editor) {
			
			editor.on('change', this._onEdit)
			editor.on('keyup', this.onKeyUp)
			editor.setSize(null, height_of(this._node))
		}
	}

	componentDidUpdate() {
		this.hz = true
		this.editor.options.hintOptions.variableToType = this.props.variableToType
		this.hz = false
	}

	componentWillUnmount() {
		if (this.editor) {
			this.editor.off('change', this._onEdit)
			this.editor.off('keyup', this.onKeyUp);
			this.editor = null;
		}
	}

	render() {
		return (
			<section
				className="variable-editor"
				ref={node => {
				this._node = node;
				}}
			/>
		)
	}
}