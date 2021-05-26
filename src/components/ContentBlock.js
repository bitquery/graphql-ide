import React, { Component } from 'react'
import 'codemirror/lib/codemirror.css'

export class ContentBlock extends Component {
    _node = null
	cachedValue = ''
	constructor(props) {
		super(props)
		this.cachedValue = props.value || ''
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
		require('codemirror/mode/gfm/gfm')
		const editor = (this.editor = CodeMirror(this._node, {
			value: this.props.value || '',
			lineNumbers: true,
			tabSize: 2,
			mode: 'gfm',
			theme: 'graphiql',
			keyMap: 'sublime',
			autoCloseBrackets: true,
			matchBrackets: true,
			showCursorWhenSelecting: true,
			readOnly: false,
			foldGutter: {
				minFoldSize: 4,
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
			editor.on('change', this._onEdit)
		}
    }
	componentDidUpdate(prevProps) {
		this.ignoreChangeEvent = true;
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
			this.editor.off('change', this._onEdit)
			this.editor = null
		}
	}
    _onEdit = () => {
		if (!this.ignoreChangeEvent && this.editor) {
			this.cachedValue = this.editor.getValue()
			if (this.props.onEdit) {
				return this.props.onEdit({content: this.cachedValue})
			}
		}
	}
    render() {
        return (
            <>
				<section
					className="block__content"
					aria-label="Content block"
					ref={node => {
						this._node = node
					}}
				/>
				<div className="handle"
				/>
			</>
        )
    }
}

export default ContentBlock
