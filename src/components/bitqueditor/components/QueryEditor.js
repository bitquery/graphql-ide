import React, { Component, PureComponent } from 'react'
import 'codemirror/lib/codemirror.css'
import 'graphiql/graphiql.min.css'
import { height_of } from '../../../utils/common'

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

export default class QueryEditor extends PureComponent {
	editor = null
	_node = null
	cachedValue = ''
	ignoreChangeEvent = false
	wrapperHeight = null
	number = 0

	constructor(props) {
		super(props)
		this.state = {
			start_x: 0,
			start_y: 0,
			start_h: 0,
			mouseDown: false
		}
		this.onRelease = this.onRelease.bind(this)
		this.cachedValue = props.value || ''
		this.number = props.number
	}
	
	onDrag = (e) => {
		if (this.editor && this.state.mouseDown) {
			const editorWrapper = document.getElementsByClassName('editor__wrapper')[this.number]
			if (this.wrapperHeight === null) this.wrapperHeight = height_of(editorWrapper)
			const newSize = this.state.start_h + e.y - this.state.start_y
			if (newSize <= this.wrapperHeight-67) {
				this.editor.setSize(null, (this.state.start_h + e.y - this.state.start_y) + "px")
			}
		}
	}
	onRelease(e) {
		this.setState({mouseDown: false})
	}
	onMouseDown = (e) => {
		this.setState({
			start_x: e.clientX,
			start_y: e.clientY,
			start_h: height_of(this._node),
			mouseDown: true
		})
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
				return this.props.onEdit({query: this.cachedValue})
			}
		}
	}
	getEditor = () => this.editor

	componentDidMount() {
		const CodeMirror = require('codemirror');
		require('codemirror/addon/hint/show-hint');
		require('codemirror/addon/comment/comment');
		require('codemirror/addon/edit/matchbrackets');
		require('codemirror/addon/edit/closebrackets');
		require('codemirror/addon/fold/foldgutter');
		require('codemirror/addon/fold/brace-fold');
		require('codemirror/addon/search/search');
		require('codemirror/addon/search/searchcursor');
		require('codemirror/addon/search/jump-to-line');
		require('codemirror/addon/dialog/dialog');
		require('codemirror/addon/lint/lint');
		require('codemirror/keymap/sublime');
		require('codemirror-graphql/hint');
		require('codemirror-graphql/lint');
		require('codemirror-graphql/info');
		require('codemirror-graphql/jump');
		require('codemirror-graphql/mode');

		const editor = (this.editor = CodeMirror(this._node, {
			value: this.props.value || '',
			lineNumbers: true,
			tabSize: 2,
			mode: 'graphql',
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
				schema: this.props.schema,
			},
			hintOptions: {
				schema: this.props.schema,
				closeOnUnfocus: false,
				completeSingle: false,
				container: this._node,
			},
			info: {
				schema: this.props.schema
			},
			jump: {
				schema: this.props.schema
			},
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
		}))
		if (editor) {
			window.addEventListener("mousemove", this.onDrag);
			document.body.addEventListener("mouseup", this.onRelease);
			editor.on('change', this._onEdit)
			editor.on('keyup', this.onKeyUp)
			
		}
	}

	componentDidUpdate(prevProps) {
		const CodeMirror = require('codemirror');

		this.ignoreChangeEvent = true;
		if (this.props.schema !== prevProps.schema && this.editor) {
			this.editor.options.lint.schema = this.props.schema;
			this.editor.options.hintOptions.schema = this.props.schema;
			this.editor.options.info.schema = this.props.schema;
			this.editor.options.jump.schema = this.props.schema;
			CodeMirror.signal(this.editor, 'change', this.editor);
		}
		if (
			this.props.value !== prevProps.value &&
			this.props.value !== this.cachedValue &&
			this.editor
		) {
			this.cachedValue = this.props.value;
			this.editor.operation(() => {
				const cursor = this.editor.getCursor()
				this.editor.setValue(this.props.value)
				this.editor.setCursor(cursor)
			})
		}
		this.ignoreChangeEvent = false;
	  }

	componentWillUnmount() {
		if (this.editor) {
			this.editor.off('keyup', this.onKeyUp)
			this.editor.off('change', this._onEdit)
			window.removeEventListener("mousemove", this.onDrag)
			document.body.removeEventListener("mouseup", this.onRelease)
			this.editor = null
		}
	}

	render() {
		return (
			<>
				<section
					className="query-editor"
					aria-label="Query Editor"
					ref={node => {
						this._node = node
					}}
				/>
				<div className="handle"
					onMouseDown={this.onMouseDown}
				/>
			</>
		)
	}
}
