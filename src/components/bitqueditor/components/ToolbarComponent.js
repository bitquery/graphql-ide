import { observer } from 'mobx-react-lite'
import { QueriesStore, UserStore, TabsStore } from '../../../store/queriesStore'
import { copyQuery } from '../../../api/api'
import modalStore from '../../../store/modalStore'
import { useToasts } from 'react-toast-notifications'
import { parse as parseGql } from 'graphql/language'
import { print } from 'graphql'
import React, { useState, useEffect } from 'react'
import StatisticsButton from './StatisticsButton'
import { GalleryStore } from '../../../store/galleryStore'
import ToolbarButton from './ToolbarButton'
import copy from 'copy-to-clipboard'
import { Form, InputGroup } from 'react-bootstrap'
import DocsIcon from '../../icons/DocsIcon'

const ToolbarComponent = observer(({ queryEditor, variablesEditor, docExplorerOpen, toggleDocExplorer, toggleCodeSnippet, codeSnippetOpen, number}) => {
	const { currentQuery, updateQuery, setQuery,
		queryIsTransfered, setQueryIsTransfered, query } = QueriesStore
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
			account_id: null,
			name: `Copy of ${currentQuery.name || 'New Query'}`,
			saved: false,
			url: null
		})
	}
	const handleCopy = async () => {
		let link
		if (!currentQuery.url) {
			const { data } = await copyQuery({
				queryID: currentQuery.graphqlQueryID,
				query: {
					query: currentQuery.query,
					variables: currentQuery.variables
				}
			})
			link = data
		} else {
			link = `${window.location.protocol}//${window.location.host}/${currentQuery.url}`
		}
		copy(link)
		addToast('Link copied to clipboard', {appearance: 'success'})
	}

	const toolbar = <div className="topBarWrap">
		<div className="topBar">
			{!tagListIsOpen &&<i className="bi bi-chevron-double-right cursor-pointer ml-2" onClick={toggleTagsList} />}
			{dashboardOwner && !(!currentQuery.id || !currentQuery.saved) && currentQuery.layout 
				&& <button type="button" className="topBar__button" onClick={switchMode}>Edit</button>}
			{user?.id && <ToolbarButton
				aria-labelledby={currentQuery.id}
				title='Save'
				onClick={()=>{toggleModal();toggleEditDialog();}}
				visible={((currentQuery.account_id===user?.id) || (!currentQuery.id && !currentQuery.account_id)) && !(!!currentQuery?.url && !!currentQuery.id)}
			/>}
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
				visible={true}
			/>
			<ToolbarButton 
				title='Copy query URL'
				onClick={handleCopy}
				visible={!!currentQuery.graphqlQueryID || !!currentQuery.url}
			/>
			<InputGroup >
				<Form.Control id="basic-url" 
					aria-label="endpoint-url"
					value={currentQuery.endpoint_url}
					onChange={handleInputURLChange} 
				/>
				{currentQuery.endpoint_url === 'https://streaming.bitquery.io/graphql' && <sup className='text-success'>New</sup>}
			</InputGroup>
			{user?.id && query[number].graphqlQueryID && <StatisticsButton number={number} />}
			{!!currentQuery.graphqlQueryID && user?.id && <a 
				target='_blank'
				className='topBar__button'
				href={`https://share.hsforms.com/1jhT3wGXlR4-mzU5DYZCHHA3rc4g?account_id=${user.id}&query_id=${currentQuery.graphqlQueryID}`}
			>
				Get historical data
			</a>}
			<button className="newGallery__topbar" aria-label="Documentation Explorer" onClick={toggleDocExplorer}>
				<DocsIcon className={"docs_icon"+(docExplorerOpen ? " active" : '')} data-toggle="tooltip" data-placement="top" title="Tooltip on top" />
			</button>
			<button className="newGallery__topbar" aria-label="Code Snippet" onClick={toggleCodeSnippet}>
				<i className={"bi bi-code-slash" + (codeSnippetOpen ? " active" : '')} />
			</button>
		</div>
	</div>
	return toolbar
})

export default ToolbarComponent
