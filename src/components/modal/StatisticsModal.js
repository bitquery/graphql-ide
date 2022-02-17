import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { QueriesStore, UserStore } from '../../store/queriesStore'
import Loader from "react-loader-spinner"
  
const StatisticsModal = observer(function StatisticsModal({active}) {
	const { currentQuery } = QueriesStore
	const { user } = UserStore
	const [metrics, setMetrics] = useState(undefined)

	const getMetrics = async () => {
		if (user.key) {
			const response = await fetch("https://graphql.bitquery.io/", {
				"headers": {
					"accept": "application/json",
					"content-type": "application/json",
					"x-api-key": user.key
				},
				"body": `{\"query\":\"query MyQuery {\\n  metrics(queryId: \\\"${currentQuery.graphqlQueryID}\\\") {\\n    points\\n    id\\n    sqlRequestsCount\\n    list {\\n      cost\\n      max\\n      min\\n      name\\n      price\\n      value\\n    }\\n  }\\n}\\n\",\"variables\":\"{}\"}`,
				"method": "POST",
				"mode": "cors",
			})
			const { data } = await response.json()
			setMetrics(data.metrics)
		}
	}

	useEffect(() => {
		getMetrics()
	}, [])
	
	return (
		active && metrics ? <div className={'modal__form '+(!active && 'modal__form_hide')}>
			<p>Points Consumed: <span>{metrics.points}</span></p>
			<p>SQL Request Count: <span>{metrics.sqlRequestsCount}</span></p>
			<label>Details:</label>
			<table class="table table-bordered table-striped statisticsTable">
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
							<td style={{ "--part": `${Math.round(metric.value/metric.max*100)}%`}}>{metric.cost/metric.price}</td>
							<td>{metric.price}</td>
							<td>{metric.cost}</td>
						</tr>
					)})}
				</tbody>
			</table>
			<p>Query ID: {currentQuery.graphqlQueryID}</p>
		</div> : metrics === null ? 'No info' : <div className='d-flex justify-content-center'>
			<Loader type='Triangle'/>
		</div>
	)
})

export default StatisticsModal
