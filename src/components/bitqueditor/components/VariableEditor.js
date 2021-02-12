import React, { Component } from 'react'
import 'codemirror/lib/codemirror.css'
import { height_of } from '../../../utils/common'

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

export default class VariableEditor extends Component {
	editor = null
	_node = null
	cachedValue = ''
	ignoreChangeEvent = false

	constructor(props) {
		super(props)
		this.state = {
			mouseDown : false
		}
		this.cachedValue = props.value || ''
	}

	onKeyUp = (cm, event) => {
		if (AUTO_COMPLETE_AFTER_KEY.test(event.key) && this.editor) {
		  this.editor.execCommand('autocomplete');
		}
	}
	_onEdit = () => {
		if (!this.ignoreChangeEvent && this.editor) {
			this.cachedValue = this.editor.getValue()
			if (this.props.onEdit) {
				return this.props.onEdit({variables: this.cachedValue})
			}
		}
	}
	getEditor = () => this.editor

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

	componentDidUpdate(prevProps) {
		this.CodeMirror = require('codemirror');
		if (!this.editor) {
		  return;
		}
		this.ignoreChangeEvent = true;
		if (this.props.variableToType !== prevProps.variableToType) {
		  this.editor.options.lint.variableToType = this.props.variableToType;
		  this.editor.options.hintOptions.variableToType = this.props.variableToType;
		  this.CodeMirror.signal(this.editor, 'change', this.editor);
		}
		if (
		  this.props.value !== prevProps.value &&
		  this.props.value !== this.cachedValue
		) {
			this.cachedValue = this.props.value
			this.editor.operation(() => {
				const cursor = this.editor.getCursor()
				this.editor.setCursor(cursor)
				this.editor.setValue(this.props.value)
			})
		}
		this.ignoreChangeEvent = false;
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