import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {QueriesStore, TabsStore, UserStore} from '../../store/queriesStore'
import modalStore from '../../store/modalStore'
import Loader from "react-loader-spinner"
import {toast} from "react-toastify"
import {getUser} from '../../api/api'
import {useInterval} from '../../utils/useInterval'
import {Modal, Table, Button} from 'react-bootstrap'
import VideoModal from './VideoModal'

const METRICS_INFO = [
    'Memory consumption by the query.',
    'Number of bytes (the number of bytes before decompression) read from compressed sources (files, network).',
    'RAM volume in bytes used to store a query result.',
    `Total number of rows read from all tables and table functions participated in query...`,
    'Number of rows in a result of the SELECT query, or a number of rows in the INSERT query.',
    'CPU time spent seen by OS. Does not include involuntary waits...',
    'Number of SQL requests.'
]

const StatisticsModal = observer(function StatisticsModal({active}) {
    const {
        currentQuery: {graphqlQueryID, graphqlRequested, gettingPointsCount},
        updateQuery,
        queryJustSaved
    } = QueriesStore
    const {user} = UserStore
    const {index} = TabsStore
    const {toggleModal, toggleStatisticsModal} = modalStore
    const [metrics, setMetrics] = useState()
    const [metricNumber, setMetricNumber] = useState(null)
    const [showVideo, setShowVideo] = useState(false)

    const getMetrics = async () => {
        if (user?.key && active) {
            updateQuery({gettingPointsCount: gettingPointsCount + 1 || 0}, index)

            // Check token expiry
            if (user?.accessToken?.streaming_expires_on <= Date.now()) {
                try {
                    await getUser('update_token')
                } catch (error) {
                    toast.error('Token refresh failed')
                }
            }

            const response = await fetch(user.graphql_legacy_url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    ...(user.accessToken?.access_token && {Authorization: `Bearer ${user.accessToken.access_token}`})
                },
                body: JSON.stringify({
                    query: `query MyQuery {
  utilities {
    metrics(queryId: \"${graphqlQueryID}\", options: {seed: ${Date.now()}}) {
      points
      id
      sqlRequestsCount
      list { cost max min name price value divider maxUnit minUnit valueUnit }
    }
  }
}`,
                    variables: {}
                })
            })

            if (user.accessToken?.error) toast.error(`Error in accessToken: ${user.accessToken.error}`)

            const {data} = await response.json()
            if (data?.utilities?.metrics?.points != null) {
                setMetrics(data.utilities.metrics)
            }
        }
    }

    useInterval(getMetrics, (!metrics || gettingPointsCount < 9) ? 2000 : null)

    const closeHandler = () => {
        toggleModal()
        toggleStatisticsModal()
    }

    let modalBodyContent = null
    if (!graphqlRequested) {
        modalBodyContent = (
            <>
                {queryJustSaved && <p>Query ID: {graphqlQueryID}</p>}
                <p>Query is cached. Points Consumed: 0.</p>
            </>
        )
    } else if (metrics) {
        modalBodyContent = (
            <>
                <Table bordered striped hover responsive className="statisticsTable table-sm">
                    <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Consumed</th>
                        <th>Price</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {metrics.list.map((metric, idx) => (
                        <tr key={idx}>
                            <th>
                                    <span
                                        className="metrics__helper"
                                        onMouseEnter={() => setMetricNumber(idx)}
                                        onMouseLeave={() => setMetricNumber(null)}
                                    >
                                        ?
                                    </span>{' '}
                                {metric.name}
                            </th>
                            <td style={{'--part': `${Math.max(Math.round(metric.value / metric.max * 100), 20)}%`}}>
                                {(metric.cost / metric.price).toFixed(2)}
                            </td>
                            <td>{metric.price.toFixed(2)}</td>
                            <td>{metric.cost.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th id="points_total" colSpan="3">Total:</th>
                        <td>{metrics.points.toFixed(2)}</td>
                    </tr>
                    </tfoot>
                </Table>
                <p className="mb-0">Query ID: {graphqlQueryID}</p>
                {metricNumber !== null && (
                    <div className="metrics__info mt-2">{METRICS_INFO[metricNumber]}</div>
                )}
            </>
        )
    } else {
        modalBodyContent = (
            <div className="d-flex flex-column align-items-center">
                <p>Query ID: {graphqlQueryID}</p>
                <p>Waiting for processing of this query...</p>
                <Loader type="Triangle"/>
            </div>
        )
    }

    return active ? (
        <>
            <Modal show={active} onHide={closeHandler} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Statistics</Modal.Title>

                </Modal.Header>
                <Modal.Body>{modalBodyContent}</Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button onClick={() => setShowVideo(true)} className="bitquery-btn bitquery-btn-video">
                        <i className="bi bi-play-btn me-2"></i>
                        Watch video on point system
                    </Button>
                    <Button className="cancel-btn" onClick={closeHandler}>Close</Button>
                </Modal.Footer>
            </Modal>
            <VideoModal show={showVideo} onHide={() => setShowVideo(false)}
                        src={'https://www.veed.io/embed/27a10659-dbc9-489c-bc99-fabd4e3f1be8'}
            />
        </>
    ) : null
})

export default StatisticsModal