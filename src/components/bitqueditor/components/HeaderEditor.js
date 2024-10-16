import React, { Component } from 'react';
import 'codemirror/lib/codemirror.css';
import { height_of } from '../../../utils/common';


const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

export default class HeaderEditor extends Component {
    editor = null;
    _node = null;
    cachedValue = '';
    ignoreChangeEvent = false;
    wrapperHeight = null
    number = 0


    constructor(props) {
        super(props);
        this.state = {
            start_x: 0,
            start_y: 0,
            start_h: 0,
            mouseDown: false,
        };
        this.onRelease = this.onRelease.bind(this)
        this.cachedValue = props.value || '';
        this.number = props.number

    }
    onDrag = (e) => {
        if (this.editor && this.state.mouseDown) {
            const deltaY = e.clientY - this.state.start_y;

            const newSize = this.state.start_h - deltaY;
            this.calculateWrapperHeight();
            if (newSize <= this.wrapperHeight - 33 && newSize >= 25) {
                this.editor.setSize(null, newSize + "px");
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
            this.cachedValue = this.editor.getValue();
            if (this.props.onEdit) {
                try {
                    const headersObject = JSON.parse(this.cachedValue);
                    if (typeof headersObject === 'object' && headersObject !== null) {
                        return this.props.onEdit({ headers: headersObject });
                    }
                } catch (e) {
                    console.error('error parsing headers:', e);
                }
            }
        }
    };

    getEditor = () => this.editor;

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
        require('codemirror/addon/edit/matchbrackets');
        require('codemirror/addon/edit/closebrackets');
        require('codemirror/addon/fold/brace-fold');
        require('codemirror/addon/fold/foldgutter');
        require('codemirror/addon/lint/lint');
        require('codemirror/addon/search/searchcursor');
        require('codemirror/addon/search/jump-to-line');
        require('codemirror/addon/dialog/dialog');
        require('codemirror/keymap/sublime');

        const editor = (this.editor = CodeMirror(this._node, {
            value: this.props.value || '',
            lineNumbers: true,
            tabSize: 2,
            mode: 'application/json',
            theme: 'graphiql',
            keyMap: 'sublime',
            autoCloseBrackets: true,
            matchBrackets: true,
            showCursorWhenSelecting: true,
            foldGutter: {
                minFoldSize: 4,
            },
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        }));

        if (editor) {
            this.calculateWrapperHeight()
            window.addEventListener("mousemove", this.onDrag);
            document.body.addEventListener("mouseup", this.onRelease);
            editor.on('change', this._onEdit);
            editor.on('keyup', this.onKeyUp)

            editor.setSize(null, height_of(this._node));
            window.addEventListener('resize', this.calculateWrapperHeight)
            window.addEventListener('widgetresize', this.calculateWrapperHeight)
        }
    }

    componentWillUnmount() {
        if (this.editor) {
            this.editor.off('change', this._onEdit);
            window.removeEventListener('resize', this.calculateWrapperHeight)
            window.removeEventListener('widgetresize', this.calculateWrapperHeight)
            window.removeEventListener("mousemove", this.onDrag)
            document.body.removeEventListener("mouseup", this.onRelease)
            this.editor = null;
        }
    }

    render() {
        return (
            <>
                <div className="handle"
                     onMouseDown={this.onMouseDown}
                />
                <p className="headers-label">
                    <span role="img" aria-label="headers">📝</span> Headers
                    <span className="hint">(click to add headers)</span>
                </p>
                <section
                    className="header-editor"
                    aria-label="Headers Editor"
                    ref={(node) => {
                        this._node = node;
                    }}
                />
            </>
        );
    }
}
