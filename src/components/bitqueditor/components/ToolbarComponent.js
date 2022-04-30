import { observer } from 'mobx-react-lite'
import { QueriesStore, UserStore, TabsStore } from '../../../store/queriesStore'
import modalStore from '../../../store/modalStore'
import { useToasts } from 'react-toast-notifications'
import { parse as parseGql } from 'graphql/language'
import { print } from 'graphql'
import React, { useState, useEffect } from 'react'
import ToggleGroupEditor from '../../ToggleGroupEditor'
import { getWidget } from '../../../api/api'
import { Dropdown } from 'react-bootstrap'
import { toJS } from 'mobx'


const ToolbarComponent = observer(({ queryEditor, variablesEditor, docExplorerOpen, toggleDocExplorer}) => {
	const { currentQuery, saveQuery, updateQuery, 
		showSideBar, toggleSideBar, isLoaded, queryIsTransfered, setQueryIsTransfered, setQuery, query } = QueriesStore
	const { index, currentTab } = TabsStore
	const { user }  = UserStore
	const { toggleModal, toggleEditDialog, toggleDashboardSettings } = modalStore
	const { addToast } = useToasts()
	const [mode, setMode] = useState(false)
	const [dashboardOwner,setOwner] = useState(false)
	const isDashboardNotSaved = dashboardOwner && !(!currentQuery.id || !currentQuery.saved) && currentQuery.layout
	useEffect(() => {
		if (((currentQuery.layout && (currentQuery.account_id === user?.id)) || !currentQuery.id) || !currentQuery.layout) {
			setOwner(true)
			toggleSideBar(true)
		} else {
			setOwner(false)
			toggleSideBar(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, JSON.stringify(currentQuery)])
	const handleInputURLChange = e => {
		updateQuery({endpoint_url: e.target.value}, index)
	}
	const openDashboardSettings = () => {
		toggleDashboardSettings()
		toggleModal()
	}
	const switchView = () => {
		const layout = currentQuery.layout ? null : {}
		updateQuery({ layout, isDraggable: true, isResizable: true, name: !currentQuery.layout ? 'New Dashboard' : 'New Query' }, index)
	}
	const switchMode = () => {
		setMode(!mode)
		updateQuery({isDraggable: !currentQuery.isDraggable, isResizable: !currentQuery.isResizable}, index)
	}
	const saveHandle = () => {
		if (user) {
			if (currentQuery.id === null) {
				toggleEditDialog()
				toggleModal()
			} else if (!currentQuery.saved) {
				!currentQuery.layout ? saveQuery(currentQuery) 
					: saveQuery({...currentQuery, isDraggable: false, isResizable: false})
				currentQuery.layout && setMode(!mode)
			}
		} else {
			addToast('Login required to save or share queries', {appearance: 'error'})
		}
	}
	const prettifyQuery = () => {
		const editor = queryEditor.current.getEditor()
		const editorContent = editor?.getValue() ?? ''
		const prettifiedEditorContent = editorContent && print(
			parseGql(editorContent, { experimentalFragmentVariables: true }),
		)
		if (prettifiedEditorContent !== editorContent) {
			editor.setValue(prettifiedEditorContent)
		}
		const variableEditor = variablesEditor.current.getEditor()
		const variableEditorContent = variableEditor?.getValue() ?? ''
		try {
			const prettifiedVariableEditorContent = JSON.stringify(
			JSON.parse(variableEditorContent),
			null,
			2,
			)
			if (prettifiedVariableEditorContent !== variableEditorContent) {
			variableEditor.setValue(prettifiedVariableEditorContent)
			}
		} catch {
		}
	}
	useEffect(() => {
		if (queryIsTransfered) {
			prettifyQuery()
			setQueryIsTransfered(false)
		}
	}, [queryIsTransfered, prettifyQuery])
	const cancelHandle = () => {
		switchMode()
		window.dispatchEvent(new Event('setInitialDashboard'))
	}
	const pasteQuery = async () => {
		let copiedQuery = await navigator.clipboard.readText()
		console.log(copiedQuery, typeof copiedQuery)
		copiedQuery = JSON.parse(copiedQuery)
		if ('dashboard_url' in copiedQuery) {
			if (query.every(query => query?.url !== copiedQuery.dashboard_url)) {
				console.log('is')
				const { data } = await getWidget(copiedQuery.dashboard_url)
				console.log(data, typeof data)
				if (typeof data === 'object') {
					console.log('object')
					if (query.map(query=>query.id).indexOf(data.id) === -1) {
						console.log('set query')
						setQuery(data, data.id)
					}
				} 
			}
		} else {
			copiedQuery.variables = copiedQuery.arguments
			setQuery(copiedQuery, copiedQuery.id)
		}
	}

	const toolbar = (!dashboardOwner || !isLoaded) ? null : <div className="topBarWrap">
		<div className="topBar">
			{!showSideBar && <i 
				className="gallery__toggle fas fa-angle-double-right" 
				onClick={()=>toggleSideBar(!showSideBar)}
			/>}
			{(!currentQuery.id && (currentQuery.account_id === user?.id || !currentQuery.account_id)) 
				&& <ToggleGroupEditor number={currentTab} isQuery={!currentQuery.layout} switchView={switchView} />}
			{dashboardOwner && !(!currentQuery.id || !currentQuery.saved) && currentQuery.layout 
				&& <button type="button" className="topBar__button" onClick={switchMode}>Edit</button>}
			{(!currentQuery.id || !currentQuery.saved) && <button 
				className="topBar__button" 
				onClick={saveHandle}
				disabled={currentQuery.saved}
			>
				Save
			</button>}
			{!currentQuery.saved && currentQuery.layout && <button type="button" className="topBar__button" onClick={cancelHandle}>Cancel</button>}
			{dashboardOwner && currentQuery.layout &&
				<div 
					className="grid-stack-item droppable-element"
					draggable={true}
					unselectable="on"
					style={{border: '1px dashed #c0c0c0', padding: '3px'}}
					onDragStart={e => e.dataTransfer.setData("text/plain", "block.content")}
				>Text Block</div>}
			{dashboardOwner && (!currentQuery.id || !currentQuery.saved) && currentQuery.layout 
				&& <button type="button" className="topBar__button" onClick={openDashboardSettings}>Settings</button>}
			{!currentQuery.layout && <button className="topBar__button"
				onClick={prettifyQuery}
			>
				Prettify
			</button>}
			<button
				className="topBar__button"
				onClick={pasteQuery}>
					Paste
			</button>
			<Dropdown>
				<Dropdown.Toggle className='topBar__button'>Add to Dashboard</Dropdown.Toggle>
				<Dropdown.Menu>
					{query.map((query, i) => 
						'layout' in query && <Dropdown.Item
							onClick={() => window.dispatchEvent(new CustomEvent('query-request', {detail: {query: toJS(currentQuery), tabID: i}}))}
						>
							{`${query.name} id is ${i}`}
						</Dropdown.Item>
					)}
				</Dropdown.Menu>
			</Dropdown>
			{!currentQuery.layout && <input 
				className="endpointURL"
				type="text" 
				value={currentQuery.endpoint_url}
				onChange={handleInputURLChange}
			/>}
			{!docExplorerOpen ? currentQuery.layout ? <></> : 
			<button
				className="docExplorerShow"
				onClick={() => toggleDocExplorer(prev => !prev)}
				aria-label="Open Documentation Explorer">
				Docs
			</button> : currentQuery.layout ? <></> :
			<div className="doc-explorer-title-bar">
				<div className="doc-explorer-title">
					Documentation Explorer
				</div>
				<div className="doc-explorer-rhs">
					<button 
						className="docExplorerHide" 
						aria-label="Close Documentation Explorer"
						onClick={() => toggleDocExplorer(prev => !prev)}
					>
						{'\u2715'}
					</button>
				</div>
			</div>}
		</div>
	</div>
	return toolbar
})

export default ToolbarComponent
