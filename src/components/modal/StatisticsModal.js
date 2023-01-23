import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { QueriesStore, TabsStore, UserStore } from '../../store/queriesStore'
import { useInterval } from '../../utils/useInterval'
import modalStore from '../../store/modalStore'
import Loader from "react-loader-spinner"

const METRICS_INFO = [
	'Memory consumption by the query.',
	'Number of bytes (the number of bytes before decompression) read from compressed sources (files, network).',
	'RAM volume in bytes used to store a query result.',
	`Total number of rows read from all tables and table functions participated in query. It includes usual subqueries, subqueries for IN and JOIN. For distributed queries read_rows includes the total number of rows read at all replicas. Each replica sends it's read_rows value, and the server-initiator of the query summarizes all received and local values. The cache volumes do not affect this value.`,
	'Number of rows in a result of the SELECT query, or a number of rows in the INSERT query.',
	'CPU time spent seen by OS. Does not include involuntary waits due to virtualization.',
	'Number of SQL requests.'
]
  
const StatisticsModal = observer(function StatisticsModal({active}) {
	const { currentQuery: { graphqlQueryID, graphqlRequested, gettingPointsCount }, updateQuery } = QueriesStore
	const { user } = UserStore
	const { index } = TabsStore
	const { toggleModal, toggleStatisticsModal } = modalStore
	const [metrics, setMetrics] = useState(undefined)
	const [metricNumber, setMetricNumber] = useState(null)

	const getMetrics = async () => {
		if (user?.key && active) {
			updateQuery({gettingPointsCount: gettingPointsCount + 1 || 0}, index)
			const response = await fetch("https://graphql.bitquery.io/", {
				"headers": {
					"accept": "application/json",
					"content-type": "application/json",
					"x-api-key": user.key
				},
				"body": `{\"query\":\"query MyQuery {\\n utilities {\\n  metrics(queryId: \\\"${graphqlQueryID}\\\", options: {seed: ${new Date().getTime()}}) {\\n    points\\n    id\\n    sqlRequestsCount\\n    list {\\n      cost\\n      max\\n      min\\n      name\\n      price\\n      value\\n      divider\\n      maxUnit\\n      minUnit\\n      valueUnit\\n    \\n} }\\n  }\\n}\\n\",\"variables\":\"{}\"}`,
				"method": "POST",
				"mode": "cors",
			})
			const { data } = await response.json()
			if (data?.utilities?.metrics && 'points' in data.utilities.metrics) {
				setMetrics(data.utilities.metrics)
			}
		}
	}

	useInterval(() => {
		getMetrics()
	}, (!metrics || gettingPointsCount < 9) ? 2000 : null)

	const closeHandler = () => {
		toggleModal()
		toggleStatisticsModal()
	}

	let modal = null
	if (active) {
		if (!graphqlRequested) {
			modal = <div className={'modal__form '+(!active && 'modal__form_hide')}>
						<i className="handler handler__close fas fa-times" onClick={closeHandler} />
						<p>Query ID: {graphqlQueryID}</p>
						<p>Query is cached. Points Consumed: 0.</p>
					</div>
		} else
		if (metrics) {
			modal = <div className={'modal__form m-4 '+(!active && 'modal__form_hide')}>
						<i className="handler handler__close fas fa-times" onClick={closeHandler} />
						<table className="table table-bordered table-striped statisticsTable">
							<thead>
								<tr>
									<th scope="col">Metric</th>
									<th scope="col">Consumed</th>
									<th scope="col">Price</th>
									<th scope="col">Points</th>
								</tr>
							</thead>
							<tbody>
								{metrics.list.map(metric => {return (
									<tr>
										<th scope="row">
											<span 
												className="metrics__helper"
												onMouseEnter={e => setMetricNumber(e.target.parentNode.parentNode.rowIndex-1)}
												onMouseLeave={()=>setMetricNumber(null)}
											>
												?
											</span>
											{metric.name}
										</th>
										<td style={{ "--part": `${Math.round(metric.value/metric.max*100)<20 ? 20 : Math.round(metric.value/metric.max*100)}%`}}>{(metric.cost/metric.price).toFixed(2)}</td>
										<td>{metric.price.toFixed(2)}</td>
										<td>{metric.cost.toFixed(2)}</td>
									</tr>
								)})}
							</tbody>
							<tfoot>
								<th id="points_total" colSpan="3">Total: </th>
								<td>{metrics.points.toFixed(2)}</td>
							</tfoot>
						</table>
						<p>Query ID: {graphqlQueryID}</p>
						{metricNumber !== null && <div className="metrics__info">{METRICS_INFO[metricNumber]}</div>}
					</div>
		} else {
			modal = <div className={'modal__form '+(!active && 'modal__form_hide')}>
						<i className="handler handler__close fas fa-times" onClick={closeHandler} />
						<p>Query ID: {graphqlQueryID}</p>
						<p>Waiting for processing of this query...</p>
						<Loader type='Triangle'/>
					</div>
		}
	}
	
	return active ? modal : null
})

export default StatisticsModal
