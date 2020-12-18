import { observer } from 'mobx-react-lite'
import { QueriesStore, UserStore } from '../../../store/queriesStore'
import modalStore from '../../../store/modalStore'
import { useToasts } from 'react-toast-notifications'
import logo from '../../../assets/images/bitquery_logo_w.png'
import React from 'react'

const ToolbarComponent = observer(() => {
	const { currentQuery, queryParams, saveQuery, updateQuery, queryNumber } = QueriesStore
	const { user }  = UserStore
	const { toggleModal, toggleEditDialog } = modalStore
	const { addToast } = useToasts()
	const handleInputURLChange = e => {
		updateQuery({endpoint_url: e.target.value}, queryNumber)
	}
	const saveHandle = () => {
		if (user) {
			if (currentQuery.id === null) {
				toggleEditDialog()
				toggleModal()
			} else if (!currentQuery.saved) {
				saveQuery(queryParams)
			}
		} else {
			addToast('Login required to save or share queries', {appearance: 'error'})
		}
	}
	return (
		<div className="topBarWrap">
			<div className="topBar">
				<div className="topBar__logo">
					<img className="topBar__logo__img" src={logo}/>
				</div>
				<button 
					className="topBar__button" 
					onClick={saveHandle}
					disabled={currentQuery.saved}
				>
						Save
				</button>
				<input 
					className="endpointURL"
					type="text" 
					value={currentQuery.endpoint_url}
					onChange={handleInputURLChange}
				/>
			</div>
		</div>
	)
})

export default ToolbarComponent
