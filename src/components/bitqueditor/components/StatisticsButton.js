import {useInterval} from '../../../utils/useInterval'
import modalStore from '../../../store/modalStore';
import {QueriesStore, UserStore, TabsStore} from '../../../store/queriesStore';
import {observer} from 'mobx-react';
import {toast} from "react-toastify";

const StatisticsButton = observer(function StatisticsButton({number}) {
    const {toggleModal, toggleStatisticsModal} = modalStore
    const {
        currentQuery: {points, graphqlQueryID, saved, gettingPointsCount, graphqlRequested, query},
        updateQuery
    } = QueriesStore
    const {user, getUser} = UserStore
    const {index} = TabsStore
    const {statisticsModalIsOpen} = modalStore

    const getPoints = async (query) => {
        if (user.key && number === index) {
            updateQuery({gettingPointsCount: gettingPointsCount + 1 || 0}, index)
            if (user?.accessToken && user?.accessToken?.streaming_expires_on <= Date.now()) {
                try {
                    await getUser('update_token')
                } catch (error) {
                    toast.error('Token refresh failed')
                }
            }
            const response = await fetch(user?.graphql_legacy_url, {
                "headers": {
                    "accept": "application/json",
                    "content-type": "application/json",
                    ...(user?.accessToken?.access_token && {'Authorization': `Bearer ${UserStore.user?.accessToken?.access_token}`})
                },
                "body": `{\"query\":\"query MyQuery {\\n utilities {\\n  metrics(queryId: \\\"${graphqlQueryID}\\\", options: {seed: ${new Date().getTime()}}) {\\n    points\\n  \\n}}\\n}\\n\",\"variables\":\"{}\"}`,
                "method": "POST"
            })

            const {data} = await response.json()
            if (data?.utilities?.metrics && 'points' in data.utilities.metrics) {
                updateQuery({points: data.utilities.metrics.points, saved}, index)
            }
        }
    }

    useInterval(() => {
        getPoints(query)
    }, (gettingPointsCount >= 9 || !graphqlRequested || statisticsModalIsOpen) ? null : 2000)

    return (
        <button
            className={`topBar__button  ${query.startsWith('subscription') ? 'd-none' : 'd-inline-block'}`}
            onClick={() => {
                toggleModal();
                toggleStatisticsModal();
            }}
        >
            {typeof points === 'number' ? `Points consumed: ${(Math.round(points * 100) / 100).toFixed(2)}` : 'Calculating points...'}
        </button>
    )
})

export default StatisticsButton
