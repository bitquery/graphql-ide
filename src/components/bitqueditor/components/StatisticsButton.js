import React, { useEffect } from 'react'
import { useState } from 'react';
import modalStore from '../../../store/modalStore';
import { QueriesStore, UserStore, TabsStore } from '../../../store/queriesStore';

const labels = {
	calculating: 'Calculating points...',
	cached: 'Points consumed: 0',
	points: 'Points consumed: '
}

function StatisticsButton({number}) {
	const { toggleModal, toggleStatisticsModal } = modalStore
	const { currentQuery: { points, graphqlQueryID, queryCached }, currentQuery, updateQuery, queryIsLoaded } = QueriesStore
	const { user } = UserStore
	const { index } = TabsStore
	const [label, setLabel] = useState(labels.calculating)
	const counter = () => {
		let counter = 0
		return () => counter++
	}
	const getPoints = async () => {
		console.log(number, index)
		if (user.key ) {
			const response = await fetch("https://graphql.bitquery.io/", {
				"headers": {
					"accept": "application/json",
					"content-type": "application/json",
					"x-api-key": user.key
				},
				"body": `{\"query\":\"query MyQuery {\\n  metrics(queryId: \\\"${graphqlQueryID}\\\", options: {seed: ${new Date().getTime()}}) {\\n    points\\n  }\\n}\\n\",\"variables\":\"{}\"}`,
				"method": "POST"
			})
			const { data } = await response.json()
			if ('points' in data.metrics) {
				setLabel(label.points)
				updateQuery({points: data.metrics.points}, index)
			}
		}
	}
	useEffect(() => {
		console.log('we are here')
		let interval
		if (queryCached) {
			setLabel(labels.cached)
		}
		if (!points && !queryCached && graphqlQueryID) {
			setLabel(label.calculating)
			getPoints()
			interval = setInterval(getPoints, 2000)
			return () => clearInterval(interval)
		}
		if (points) clearInterval(interval)
	}, [JSON.stringify(currentQuery), graphqlQueryID, points, queryCached])

	/* let info
	if (!points && !queryCached) {
		info = 'Calculating points...'
	} else if (queryCached) {
		info = 'Points consumed: 0'
	} else if (points) {
		info = `Points consumed: ${points.toFixed(2)}`
	} */
	return (
		<button 
			className="topBar__button"
			onClick={()=>{toggleModal();toggleStatisticsModal();}}
			disabled={!points && !queryCached}
		>
			{label}
		</button>
	)
}

export default StatisticsButton