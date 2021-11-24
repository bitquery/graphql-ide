import React, { Component } from 'react'
import 'codemirror/lib/codemirror.css'
import { height_of } from '../../../utils/common'

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

export default class QueryEditor extends Component {
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
			const newSize = this.state.start_h + e.y - this.state.start_y
			this.calculateWrapperHeight()
			if (newSize <= this.wrapperHeight-33 && newSize>= 25) {
				this.editor.setSize(null, newSize + "px")
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
	calculateWrapperHeight = () => {
		const editorWrapper = this._node.parentNode
		this.wrapperHeight = editorWrapper && height_of(editorWrapper)
		const editorHeight = this.editor.getWrapperElement().offsetHeight
		if ( editorHeight > this.wrapperHeight ) {
			this.editor.setSize(null, `${this.wrapperHeight-45}px`)
		}
	}

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
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
			extraKeys: {
				'Ctrl-Space': () =>
					editor.showHint({ completeSingle: true, container: this._node }),
				'Ctrl-Enter': () => {
					if (this.props.onRunQuery) {
						this.props.onRunQuery()
					}
				},
			}
		}))
		if (editor) {
			this.calculateWrapperHeight()
			window.addEventListener("mousemove", this.onDrag);
			document.body.addEventListener("mouseup", this.onRelease);
			editor.on('change', this._onEdit)
			editor.on('keyup', this.onKeyUp)
			window.addEventListener('resize', this.calculateWrapperHeight)
			window.addEventListener('widgetresize', this.calculateWrapperHeight)
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
			window.removeEventListener('resize', this.calculateWrapperHeight)
			window.removeEventListener('widgetresize', this.calculateWrapperHeight)
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
