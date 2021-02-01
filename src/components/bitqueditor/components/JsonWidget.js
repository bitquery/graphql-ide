import React, { Component } from 'react';

class JsonWidget extends Component {
  viewer= null
  _node= null

  componentDidMount() {
    const CodeMirror = require('codemirror');
    require('codemirror/addon/fold/foldgutter');
    require('codemirror/addon/fold/brace-fold');
    require('codemirror/addon/dialog/dialog');
    require('codemirror/addon/search/search');
    require('codemirror/addon/search/searchcursor');
    require('codemirror/addon/search/jump-to-line');
    require('codemirror/keymap/sublime');
    require('codemirror-graphql/results/mode');

    this.viewer = CodeMirror(this._node, {
      lineWrapping: true,
      value: JSON.stringify(this.props.dataSource.data, null, 2) || '',
      readOnly: true,
      theme: 'graphiql',
      mode: 'graphql-results',
      keyMap: 'sublime',
      foldGutter: {
        minFoldSize: 4,
      },
      gutters: ['CodeMirror-foldgutter'],
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.dataSource !== nextProps.dataSource;
  }

  componentDidUpdate() {
    if (this.viewer) {
      this.viewer.setValue(JSON.stringify(this.props.dataSource.data, null, 2) || '');
    }
  }

  componentWillUnmount() {
    this.viewer = null;
  }

  render() {
    return (
      <section
        className="result-window"
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
		}
	}
} 

export default new JsonPlugin()
