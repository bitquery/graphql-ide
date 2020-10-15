import React, { useState, useEffect, useContext } from 'react'
import './App.scss'
import { CustomGraphiql } from './components/CustomGraphiql'
import RegisterWindow from './components/modal/RegisterWindow'
import SaveQueryWindow from './components/modal/SaveQueryWindow'
import axios from 'axios'
import { getUser } from './api/api'
import { generateLink } from './utils/common'
import { ToastContainer, toast } from 'react-toastify'
import { ModalProvider } from './components/modal/ModalContext'
import ControlPanel from './components/ControlPanel'

function App() {
	const [tabs, setTabs] = useState(['1'])
	const [currentTab, setCurrentTab] = useState('1')
	const [user, setUser] = useState(null)
	const [currentQuery, setCurrentQuery] = useState('')
	const [queries, setQueries] = useState(null)

	const notify = message => toast(message)
	const params = () => {
		let params = {
			account_id: user.id,
			query: currentQuery,
			arguments: 'arguments',
			// name: query_name || null,
			// description: query_description || null
		}
		return {
			value: () => params,
			withUrl: () => {
				params.url = this.link = generateLink()
				return params
			}
		}
	}
	const getMyUser = async () => {
		try {
			const { data } = await getUser()
			setUser(data.user[0])
		} catch (e) { console.log(e.response.data) } 
	}
	useEffect(() => {
		getMyUser()
		setCurrentQuery(localStorage.getItem('graphiql:query'))
		async function getQueries() {
			try {
				const { data } = await axios.get('/api/getqueries')
				setQueries(data)
			} catch (e) { console.log(e) }
		}
		getQueries()
	}, [])

	return (
		<ModalProvider >
			<div className="App">
				<RegisterWindow getUser={getMyUser} />
				<SaveQueryWindow />
				<ControlPanel 
					tabs={tabs}
					currentTab={currentTab}
					setCurrentTab={setCurrentTab}
					setTabs={setTabs}
					user={user} setUser={setUser}
				/>
				<CustomGraphiql 
					currentTab={currentTab}
					tabs={tabs}  
				/>
			</div>
		</ModalProvider>
	)
}

export default App;
