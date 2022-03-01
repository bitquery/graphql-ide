import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { QueriesStore, UserStore } from '../../store/queriesStore'
import { useInterval } from '../../utils/useInterval'
import modalStore from '../../store/modalStore'
import Loader from "react-loader-spinner"
  
const StatisticsModal = observer(function StatisticsModal({active}) {
	const { currentQuery: { points, graphqlQueryID, graphqlRequested } } = QueriesStore
	const { user } = UserStore
	const { toggleModal, toggleStatisticsModal } = modalStore
	const [metrics, setMetrics] = useState(undefined)
	const [count, setCount] = useState(0)

	const getMetrics = async () => {
		if (user.key) {
			const response = await fetch("https://graphql.bitquery.io/", {
				"headers": {
					"accept": "application/json",
					"content-type": "application/json",
					"x-api-key": user.key
				},
				"body": `{\"query\":\"query MyQuery {\\n  metrics(queryId: \\\"${graphqlQueryID}\\\", options: {seed: ${new Date().getTime()}}) {\\n    points\\n    id\\n    sqlRequestsCount\\n    list {\\n      cost\\n      max\\n      min\\n      name\\n      price\\n      value\\n      divider\\n      maxUnit\\n      minUnit\\n      valueUnit\\n    }\\n  }\\n}\\n\",\"variables\":\"{}\"}`,
				"method": "POST",
				"mode": "cors",
			})
			const { data } = await response.json()
			if (data.metrics && 'points' in data.metrics) {
				setMetrics(data.metrics)
			}
		}
	}

	useEffect(() => {
		graphqlRequested ? setCount(0) : setCount(10)
	}, [points, graphqlRequested])

	useInterval(() => {
		setCount(prev => prev + 1)
		getMetrics()
	}, count < 10 ? 2000 : null)

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
			modal = <div className={'modal__form '+(!active && 'modal__form_hide')}>
						<i className="handler handler__close fas fa-times" onClick={closeHandler} />
						<table class="table table-bordered table-striped statisticsTable mt-4">
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
										<th scope="row">{metric.name}</th>
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
	
	return modal
})

export default StatisticsModal
