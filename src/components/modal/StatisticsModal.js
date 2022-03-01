import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { QueriesStore, UserStore } from '../../store/queriesStore'
import modalStore from '../../store/modalStore'
import Loader from "react-loader-spinner"
  
const StatisticsModal = observer(function StatisticsModal({active}) {
	const { currentQuery } = QueriesStore
	const { user } = UserStore
	const { toggleModal, toggleStatisticsModal } = modalStore
	const [metrics, setMetrics] = useState(undefined)

	const getMetrics = async () => {
		if (user.key) {
			const response = await fetch("https://graphql.bitquery.io/", {
				"headers": {
					"accept": "application/json",
					"content-type": "application/json",
					"x-api-key": user.key
				},
				"body": `{\"query\":\"query MyQuery {\\n  metrics(queryId: \\\"${currentQuery.graphqlQueryID}\\\", options: {seed: ${new Date().getTime()}}) {\\n    points\\n    id\\n    sqlRequestsCount\\n    list {\\n      cost\\n      max\\n      min\\n      name\\n      price\\n      value\\n      divider\\n      maxUnit\\n      minUnit\\n      valueUnit\\n    }\\n  }\\n}\\n\",\"variables\":\"{}\"}`,
				"method": "POST",
				"mode": "cors",
			})
			const { data } = await response.json()
			setMetrics(data.metrics)
		}
	}

	useEffect(() => {
		if (currentQuery.queryCached) {
			if (!metrics) {
				getMetrics()
				const interval = setInterval(getMetrics, 5000)
				return () => clearInterval(interval)
			}
		}
	}, [metrics])

	const closeHandler = () => {
		toggleModal()
		toggleStatisticsModal()
	}

	let modal = null
	if (active) {
		if (!currentQuery.queryCached) {
			modal = <div className={'modal__form '+(!active && 'modal__form_hide')}>
						<i className="handler handler__close fas fa-times" onClick={closeHandler} />
						<p>Query ID: {currentQuery.graphqlQueryID}</p>
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
						<p>Query ID: {currentQuery.graphqlQueryID}</p>
					</div>
		} else {
			modal = <div className={'modal__form '+(!active && 'modal__form_hide')}>
						<i className="handler handler__close fas fa-times" onClick={closeHandler} />
						<p>Query ID: {currentQuery.graphqlQueryID}</p>
						<p>Waiting for processing of this query...</p>
						<Loader type='Triangle'/>
					</div>
		}
	}
	
	return modal
})

export default StatisticsModal
