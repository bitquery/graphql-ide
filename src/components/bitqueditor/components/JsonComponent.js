export default class JsonComponent {
    constructor(element, historyDataSource, subscriptionDataSource) {
        this.container = element
        this.timers = {}
        this.historyDataSource = historyDataSource
        this.subscriptionDataSource = subscriptionDataSource
    }

    async init(run = true) {
        await this.initialize(run)
    }

    async initialize(run) {
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
        require('../../../utils/streaming-mode')

        this.viewer = CodeMirror(this.container, {
            autoRefresh: true,
            lineWrapping: true,
            value: '',
            readOnly: true,
            scrollbarStyle: null,
            theme: 'graphiql',
            mode: `graphql-results${this.subscriptionDataSource ? '-streaming' : ''}`,
            keyMap: 'sublime',
            foldGutter: {
                minFoldSize: 4,
            },
            gutters: ['CodeMirror-foldgutter'],
        });
        if (this.historyDataSource) {
            this.historyDataSource.setCallback(this.onHistoryData.bind(this))
            run && await this.historyDataSource.changeVariables()
        }
        if (this.subscriptionDataSource) {
            this.subscriptionDataSource.setCallback(this.onSubscriptionData.bind(this))
            this.subscriptionDataSource.setClean(this.clean.bind(this))
            this.subscriptionDataSource.setEmptyWidget(this.emptyWidget.bind(this))
            run && this.subscriptionDataSource.changeVariables()
        }
    }

    clean() {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }

    emptyWidget() {
        this.viewer.setValue('')
        this.clean()
        this.timers = {}
    }

    onHistoryData(data) {
        this.viewer.setValue(JSON.stringify(data, null, 2))
    }

    onSubscriptionData(data) {
        this.viewer.replaceRange('0.000 seconds ago\n', {line: 0, ch: 0})
        this.viewer.replaceRange(`${JSON.stringify(data, null, 2)}\n`, {line: 1, ch: 0})
        this.timers[String(new Date().getTime())] = this.viewer.getLineHandle(0)
        this.clean()
        this.interval = setInterval(() => {
            for (const timeString in this.timers) {
                const time = parseInt(timeString, 10)
                const lineNumber = this.viewer.lineInfo(this.timers[timeString]).line
                const timeDifference = new Date().getTime() - time
                const seconds = Math.floor(timeDifference / 1000)
                const milliseconds = timeDifference % 1000
                const newTime = `${seconds}.${milliseconds.toString().padStart(3, '0')} seconds ago`
                this.viewer.replaceRange(newTime, {line: lineNumber, ch: 0}, {line: lineNumber, ch: Infinity})
            }
        }, 10)
    }

}