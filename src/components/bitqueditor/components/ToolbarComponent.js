import { observer } from 'mobx-react-lite'
import { QueriesStore, UserStore, TabsStore } from '../../../store/queriesStore'
import modalStore from '../../../store/modalStore'
import { useToasts } from 'react-toast-notifications'
import { useRouteMatch } from 'react-router-dom'
import { parse as parseGql } from 'graphql/language'
import { print } from 'graphql'
import React, { useState, useEffect } from 'react'
import StatisticsButton from './StatisticsButton'
import { GalleryStore } from '../../../store/galleryStore'
import ToolbarButton from './ToolbarButton'
import copy from 'copy-to-clipboard'
import { Form } from 'react-bootstrap'

const ToolbarComponent = observer(({ queryEditor, variablesEditor, docExplorerOpen, toggleDocExplorer, number}) => {
	const { url } = useRouteMatch()
	const { currentQuery, saveQuery, updateQuery, setQuery,
		isLoaded, queryIsTransfered, setQueryIsTransfered } = QueriesStore
	const { tagListIsOpen, toggleTagsList } = GalleryStore
	const { index } = TabsStore
	const { user }  = UserStore
	const { toggleModal, toggleEditDialog, toggleDashboardSettings } = modalStore
	const { addToast } = useToasts()
	const [mode, setMode] = useState(false)
	const [dashboardOwner,setOwner] = useState(false)
	useEffect(() => {
		if (((currentQuery.layout && (currentQuery.account_id === user?.id)) || !currentQuery.id) || !currentQuery.layout) {
			setOwner(true)
		} else {
			setOwner(false)
		}
		// eslint-disable-next-line 
	}, [user, JSON.stringify(currentQuery)])
	const handleInputURLChange = e => {
		updateQuery({endpoint_url: e.target.value}, index)
	}
	const openDashboardSettings = () => {
		toggleDashboardSettings()
		toggleModal()
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
			try {
				prettifyQuery()
			} catch (error) {
				console.log(error)
			}
			setQueryIsTransfered(false)
		}
	}, [queryIsTransfered, prettifyQuery])
	const cancelHandle = () => {
		switchMode()
		window.dispatchEvent(new Event('setInitialDashboard'))
	}
	const handleFork = () => {
		setQuery({
			...currentQuery,
			id: null,
			name: `Copy of ${currentQuery.name}`,
			saved: false,
			url: null
		})
	}
	const handleCopy = () => {
		copy(`${window.location.protocol}//${window.location.host}${url.match(/^\/([^?\/]+)/)[0]}/${currentQuery.url}`)
		addToast('Link copied to clipboard', {appearance: 'success'})
	}

	const toolbar = (!dashboardOwner || !isLoaded) ? null : <div className="topBarWrap">
		<div className="topBar">
			{!tagListIsOpen &&<i className="bi bi-chevron-double-right cursor-pointer" onClick={toggleTagsList} />}
			{dashboardOwner && !(!currentQuery.id || !currentQuery.saved) && currentQuery.layout 
				&& <button type="button" className="topBar__button" onClick={switchMode}>Edit</button>}
			<ToolbarButton
				title='Save'
				onClick={()=>{toggleModal();toggleEditDialog();}}
				visible={((currentQuery.account_id===user?.id) || (!currentQuery.id && !currentQuery.account_id)) && !(!!currentQuery?.url && !!currentQuery.id)}
			/>
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
			{(currentQuery?.url && currentQuery.id) 
			? null 
			: <ToolbarButton 
				title='Prettify'
				onClick={prettifyQuery}
			/> }
			<ToolbarButton 
				title='Fork'
				onClick={handleFork}
				visible={currentQuery.id}
			/>
			<ToolbarButton 
				title='Copy query URL'
				onClick={handleCopy}
				visible={!!currentQuery.url}
			/>
			<Form.Control 
				type="text" 
				value={currentQuery.endpoint_url}
				onChange={handleInputURLChange} 
			/>
			{user?.id && currentQuery.graphqlQueryID && <StatisticsButton number={number} />}
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
