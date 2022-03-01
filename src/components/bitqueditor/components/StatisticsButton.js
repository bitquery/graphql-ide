import React, { useEffect } from 'react'
import modalStore from '../../../store/modalStore';
import { QueriesStore, UserStore, TabsStore } from '../../../store/queriesStore';

function StatisticsButton({number}) {
	const { toggleModal, toggleStatisticsModal } = modalStore
	const { currentQuery: { points, graphqlQueryID, graphqlRequested }, updateQuery } = QueriesStore
	const { user } = UserStore
	const { index } = TabsStore
	
	const getPoints = async () => {
		if (user.key && number === index ) {
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
				updateQuery({points: data.metrics.points}, index)
			}
		}
	}

	useEffect(() => {
		if (graphqlRequested) {
			if (!points) {
				const interval = setInterval(getPoints, 3000)
				return () => clearInterval(interval)
			}
		}
	}, [graphqlQueryID, graphqlRequested, points])

	return (
		<button 
			className="topBar__button"
			onClick={()=>{toggleModal();toggleStatisticsModal();}}
		>
			{typeof points === 'number' ? `Points consumed: ${(Math.round(points * 100) / 100).toFixed(2)}` : 'Calculating points...'}
		</button>
	)
}

export default StatisticsButton