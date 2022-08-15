import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import codegen from "postman-code-generators"
import { QueriesStore, UserStore } from '../store/queriesStore'
import { getCodeSnippet } from '../utils/getCodeSnippet'
import RawCodeMirror from './bitqueditor/components/RawCodeMirror'
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'

const languageList = codegen.getLanguageList()

const CodeSnippetComponent = observer(function CodeSnippetComponent() {

	const { currentQuery: { endpoint_url, query, variables } } = QueriesStore
	const { user } = UserStore
	const { addToast } = useToasts()

	const [selectedLanguage, setSelectedLanguage] = useState(
		{
			"key": "curl",
			"label": "cURL",
			"syntax_mode": "powershell",
			"variant": "cURL"
		}
	)
	const [snippet, setSnippet] = useState('')

	const handleCopy = () => {
		copy(snippet)
		addToast('Copied to clipboard', {appearance: 'success'})
	}

	const main = async () => {
		if (!user) return
		const snippet = await getCodeSnippet(selectedLanguage, query, variables, user.key, endpoint_url)
		setSnippet(snippet)
	}

	useEffect(() => {
		main()
	}, [selectedLanguage, user, query, variables, endpoint_url])

	return (
		<section className='codesnippet__root'>
			<div className="doc-explorer-title-bar">
				<div className="doc-explorer-title">Code snippet</div>
			</div>
			<div className="options flex">
				<div className="navbar-collapse mr-auto" id="navbarCodeSnippet">
					<ul className={'navbar-nav mr-auto'}>
						<li className="nav-item dropdown">
							<a 	className="nav-link dropdown-toggle" 
								href="# "
								id="navbarDropdown" 
								role="button" 
								data-toggle="dropdown" 
								aria-haspopup="true" 
								aria-expanded="false"
							>
								{ `${selectedLanguage.label}` } { selectedLanguage.variant !== selectedLanguage.label && ` - ${selectedLanguage.variant}` }
							</a>
							<div className="dropdown-menu" disabled>
								{languageList.map(item => item.variants.map(( { key }, i ) => (
									<a  className="dropdown-item" href="# " key={key} onClick={() => setSelectedLanguage({...item, variant: key})}>
										{ item.label } { key !== item.key && ` - ${key}` }
									</a>
								)))}
							</div>
						</li>
					</ul>
				</div>
				<div className="buttons">
					<i className="bi bi-back" onClick={handleCopy} />
				</div>
			</div>
			<div className='card'>
				<RawCodeMirror mode={selectedLanguage.syntax_mode} value={snippet}/>
			</div>
		</section>
	)
})

export default CodeSnippetComponent