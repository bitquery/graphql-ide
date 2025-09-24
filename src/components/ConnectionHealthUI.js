import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { connectionHealthStore } from '../utils/ConnectionHealth'

const statusConfig = {
    internet_ok: {
        color: '#28a745',
        bgColor: '#d4edda',
        icon: 'bi-wifi',
        text: 'Connected',
        tooltip: 'Connection is stable. Ping < 200ms, data is flowing regularly.'
    },
    internet_slow: {
        color: '#fd7e14',
        bgColor: '#fff3cd',
        icon: 'bi-wifi-1',
        text: 'Slow',
        tooltip: 'Slow connection. Ping ≥ 200ms, but data is still flowing.'
    },
    internet_lost: {
        color: '#dc3545',
        bgColor: '#f8d7da',
        icon: 'bi-wifi-off',
        text: 'Disconnected',
        tooltip: 'Connection lost. Server not responding to ping for more than 3 seconds.'
    },
    api_lagging: {
        color: '#ffc107',
        bgColor: '#fff3cd',
        icon: 'bi-clock',
        text: 'Delay',
        tooltip: 'API lagging. Internet works but no data received for more than 10 seconds.'
    },
    unknown: {
        color: '#6c757d',
        bgColor: '#e9ecef',
        icon: 'bi-question-circle',
        text: 'Unknown',
        tooltip: 'Connecting to WebSocket. Waiting for first data and latency measurement...'
    }
}

const ConnectionHealthUI = observer(({ compact = false, store }) => {
    const s = store || connectionHealthStore
    const config = statusConfig[s.status] || statusConfig.unknown

    useEffect(() => {
        console.log('ConnectionHealthUI: Current status:', s.status, 'latency:', s.latency)
    }, [s.status, s.latency])

    if (compact) {
        const tooltipText = s.latency > 0
            ? `${config.tooltip} Latency: ${s.latency}ms`
            : config.tooltip

        return (
            <div
                className="d-flex align-items-center px-2"
                style={{ fontSize: '14px' }}
                title={tooltipText}
            >
                <i className={`bi ${config.icon}`} style={{ color: config.color, fontSize: '14px' }}></i>
                {s.latency > 0 && (
                    <span style={{ color: config.color, marginLeft: 4, fontSize: '14px' }}>
                        {s.latency}ms
                    </span>
                )}
            </div>
        )
    }

    const tooltipText = s.latency > 0
        ? `${config.tooltip} Latency: ${s.latency}ms`
        : config.tooltip

    return (
        <div
            className="d-flex align-items-center px-2 rounded"
            style={{
                backgroundColor: config.bgColor,
                border: `1px solid ${config.color}`,
                marginLeft: 8,
                minWidth: 120,
                fontSize: '16px'
            }}
            title={tooltipText}
        >
            <i className={`bi ${config.icon} me-1`} style={{ color: config.color }}></i>
            <span style={{ color: config.color, fontWeight: '500' }}>
                {config.text}
            </span>
            {s.latency > 0 && (
                <span style={{ color: config.color, marginLeft: 4, fontSize: '14px' }}>
                    {s.latency}ms
                </span>
            )}
        </div>
    )
})

export default ConnectionHealthUI