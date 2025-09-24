import { makeAutoObservable } from 'mobx'

export class ConnectionHealthStore {
    status = 'unknown'
    latency = 0
    lastDataAt = Date.now()
    pongTimeout = null
    dataCheckInterval = null
    hasReceivedData = false
    hasMeasuredPing = false
    constructor() {
        makeAutoObservable(this)
    }

    onPing() {
        const pingSentAt = Date.now()
        clearTimeout(this.pongTimeout)
        this.pongTimeout = setTimeout(() => {
            this.reportStatus('internet_lost')
        }, 3000)
        this._pingSentAt = pingSentAt
    }

    onPong() {
        if (!this._pingSentAt) return
        const latency = Date.now() - this._pingSentAt
        clearTimeout(this.pongTimeout)

        this.latency = latency
        this.hasMeasuredPing = true

        if (this.hasReceivedData) {
            this.reportStatus(latency < 200 ? 'internet_ok' : 'internet_slow', latency)
        }
    }

    onData() {
        this.lastDataAt = Date.now()
        if (!this.hasReceivedData) {
            this.hasReceivedData = true
        }
    }

    startDataCheck() {
        this.stopDataCheck()
        this.dataCheckInterval = setInterval(() => {
            if (Date.now() - this.lastDataAt > 10_000) {
                this.reportStatus('api_lagging')
            }
        }, 3_000)
    }

    stopDataCheck() {
        clearInterval(this.dataCheckInterval)
        clearTimeout(this.pongTimeout)
    }

    reportStatus(status, latency = 0) {
        console.log('Connection status changed:', status, 'latency:', latency)
        this.status = status
        this.latency = latency
    }

    reset() {
        this.status = 'unknown'
        this.latency = 0
        this.lastDataAt = Date.now()
        this.hasReceivedData = false
        this.hasMeasuredPing = false
    }
}

export const connectionHealthStore = new ConnectionHealthStore()
