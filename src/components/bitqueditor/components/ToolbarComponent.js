import { observer } from 'mobx-react-lite'
import { QueriesStore, UserStore, TabsStore } from '../../../store/queriesStore'
import modalStore from '../../../store/modalStore'
import { useToasts } from 'react-toast-notifications'
import { parse as parseGql } from 'graphql/language'
import { print } from 'graphql'
import logo from '../../../assets/images/bitquery_logo_w.png'
import React from 'react'

const ToolbarComponent = observer(({ queryEditor, variablesEditor, docExplorerOpen, toggleDocExplorer }) => {
	const { currentQuery, queryParams, saveQuery, updateQuery, 
		showSideBar, toggleSideBar, defaultWidget } = QueriesStore
	const { index, toggleMode, jsonMode, codeMode, viewMode } = TabsStore
	const { user }  = UserStore
	const { toggleModal, toggleEditDialog } = modalStore
	const { addToast } = useToasts()
	const handleInputURLChange = e => {
		updateQuery({endpoint_url: e.target.value}, index)
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
	const prettifyQuery = () => {
		console.log(jsonMode, codeMode, viewMode)
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
	return (
		<div className="topBarWrap">
			<div className="topBar">
				{!showSideBar && <i 
					className="gallery__toggle fas fa-angle-double-right" 
					onClick={toggleSideBar}
				/>}
				<div className="topBar__logo">
					<img 
						className="topBar__logo__img" 
						src={logo}
						alt="logo"
					/>
				</div>
				{(!currentQuery.id || !currentQuery.saved) && <button 
					className="topBar__button" 
					onClick={saveHandle}
					disabled={currentQuery.saved}
				>
					Save
				</button>}
				<button className="topBar__button"
					onClick={prettifyQuery}
				>
					Prettify
				</button>
				{(('widget_id' in currentQuery) && currentQuery.widget_id !== defaultWidget) && 
				<div className="btn-group btn-group-toggle" data-toggle="buttons">
					<label className={"btn btn-secondary topBar__button "+(viewMode && 'active')}>
						<input type="radio" name="options" 
							id="option1" autoComplete="off" 
							defaultChecked={true}
							onClick={()=>toggleMode('view')}
						/> View
					</label>
					<label className={"btn btn-secondary topBar__button "+(jsonMode && 'active')}>
						<input type="radio" name="options" 
							id="option2" autoComplete="off" 
							defaultChecked={false}
							onClick={()=>toggleMode('json')}
						/> JSON
					</label>
					<label className={"btn btn-secondary topBar__button "+(codeMode && 'active')}>
						<input type="radio" name="options" 
							id="option3" autoComplete="off"
							defaultChecked={false}
							onClick={()=>toggleMode('code')}
						/> Checkout code
					</label>
				</div>}
				<input 
					className="endpointURL"
					type="text" 
					value={currentQuery.endpoint_url}
					onChange={handleInputURLChange}
				/>
				{!docExplorerOpen ? 
				<button
					className="docExplorerShow"
					onClick={() => toggleDocExplorer(prev => !prev)}
					aria-label="Open Documentation Explorer">
					{'Docs'}
				</button> : 
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
	)
})

export default ToolbarComponent
