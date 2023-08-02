export default class JsonComponent {
	constructor(element, historyDataSource, subscriptionDataSource) {
		this.container = element
		this.timers = {}
		this.historyDataSource = historyDataSource
		this.subscriptionDataSource = subscriptionDataSource
	}

	async init() {
		await this.initialize()
	}

	async initialize() {
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

		this.viewer = CodeMirror(this.container, {
			autoRefresh: true,
			lineWrapping: true,
			value: '',
			readOnly: true,
			scrollbarStyle: null,
			theme: 'graphiql',
			mode: 'graphql-results',
			keyMap: 'sublime',
			foldGutter: {
				minFoldSize: 4,
			},
			gutters: ['CodeMirror-foldgutter'],
		});
		if (this.historyDataSource) {
			this.historyDataSource.setCallback(this.onHistoryData.bind(this))
			this.historyDataSource && await this.historyDataSource.changeVariables()
		}
		if (this.subscriptionDataSource) {
			this.subscriptionDataSource.setCallback(this.onSubscriptionData.bind(this))
			this.subscriptionDataSource.changeVariables()
		}
	}

	onHistoryData(data) {
		this.viewer.setValue(JSON.stringify(data, null, 2))
	}

	onSubscriptionData(data) {
		const lastLine = this.viewer.lastLine()
		this.timers[lastLine] = new Date().getTime()
		if (this.interval) {
			clearInterval(this.interval)
		}
		this.interval = setInterval(() => {
			for (const timerLine in this.timers) {
				this.viewer.replaceRange(`${Math.floor((new Date().getTime() - this.timers[timerLine])/1000)} seconds ago`, {line: timerLine, ch: 0}, {line: timerLine, ch: 30})
			}
		}, 1000);
		this.viewer.replaceRange('0 seconds ago', {line: lastLine, ch: 0}, {line: lastLine, ch: 10})
		this.viewer.replaceRange(`\n${JSON.stringify(data, null, 2)}\n`, {line: lastLine+1, ch: 0})
	}
}
