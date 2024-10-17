import React, { Component } from 'react';
import 'codemirror/lib/codemirror.css';
import { height_of } from '../../../utils/common';

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

export default class HeaderEditor extends Component {
    editor = null;
    _node = null;
    wrapper = null;
    cachedValue = '';
    ignoreChangeEvent = false;
    wrapperHeight = null;
    number = 0;

    constructor(props) {
        super(props);
        this.state = {
            start_y: 0,
            start_h: 0,
            mouseDown: false,
        };
        this.onRelease = this.onRelease.bind(this);
        this.cachedValue = props.value || '';
        this.number = props.number;
    }

    onDrag = (e) => {
        if (this.wrapper && this.state.mouseDown) {
            const deltaY = this.state.start_y - e.clientY;

            const newHeight = this.state.start_h + deltaY;

            if (newHeight >= 50 && newHeight <= this.wrapperHeight + 50) {
                this.wrapper.style.height = `${newHeight}px`;
                this.editor.setSize(null, newHeight - 40 + "px");
            }
        }
    };

    onRelease() {
        this.setState({ mouseDown: false });
    }

    onMouseDown = (e) => {
        this.setState({
            start_y: e.clientY,
            start_h: height_of(this.wrapper),
            mouseDown: true
        });
    };

    onKeyUp = (cm, event) => {
        if (AUTO_COMPLETE_AFTER_KEY.test(event.key) && this.editor) {
            this.editor.execCommand('autocomplete');
        }
    };

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
                }
            }
        }
    };


    getEditor = () => this.editor;

    calculateWrapperHeight = () => {
        const editorWrapper = this.wrapper;
        this.wrapperHeight = editorWrapper && height_of(editorWrapper);
        const editorHeight = this.editor.getWrapperElement().offsetHeight;
        if (editorHeight > this.wrapperHeight) {
            this.editor.setSize(null, `${this.wrapperHeight - 45}px`);
        }
    };

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
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        }));

        if (editor) {
            this.calculateWrapperHeight();
            window.addEventListener("mousemove", this.onDrag);
            document.body.addEventListener("mouseup", this.onRelease);
            editor.on('change', this._onEdit);
            editor.on('keyup', this.onKeyUp);

            // editor.setSize(null, height_of(this._node));
            window.addEventListener('resize', this.calculateWrapperHeight);
            window.addEventListener('widgetresize', this.calculateWrapperHeight);
        }
    }

    componentWillUnmount() {
        if (this.editor) {
            this.editor.off('change', this._onEdit);
            window.removeEventListener('resize', this.calculateWrapperHeight);
            window.removeEventListener('widgetresize', this.calculateWrapperHeight);
            window.removeEventListener("mousemove", this.onDrag);
            document.body.removeEventListener("mouseup", this.onRelease);
            this.editor = null;
        }
    }

    render() {
        return (
            <div
                className="editor-wrapper"
                ref={(node) => { this.wrapper = node; }}
                style={{ position: 'relative', height: '50px' }}
            >
                <div
                    className="handle"
                    onMouseDown={this.onMouseDown}
                />
                <p className="headers-label" >
                    <span role="img" aria-label="headers">📝</span> Headers
                    <span className="hint">(add headers)</span>
                </p>
                <section
                    className="header-editor"
                    aria-label="Headers Editor"
                    ref={(node) => {
                        this._node = node;
                    }}
                    style={{ height: 'calc(100% - 40px)' }}
                />
            </div>
        );
    }
}
