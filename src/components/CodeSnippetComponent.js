import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {QueriesStore, UserStore} from '../store/queriesStore'
import RawCodeMirror from './bitqueditor/components/RawCodeMirror'
import copy from 'copy-to-clipboard'
import {toast} from 'react-toastify'
import {getCodeSnippet} from '../api/api'
import {languageList} from '../utils/snippetLanguageList'

const CodeSnippetComponent = observer(function CodeSnippetComponent() {

    const {currentQuery: {endpoint_url, query, variables}} = QueriesStore
    const {user} = UserStore

    const [language, setLanguage] = useState(
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
        toast('Copied to clipboard', {type: 'success'})
    }

    const main = async () => {
        if (!user) return
        const token =  UserStore.user?.accessToken?.access_token
        const body = {
            language,
            query,
            variables,
            endpoint_url,
            key: user.key,
            token: token
        }

    const {data: {snippet}} = await getCodeSnippet(body)

    setSnippet(snippet)
}

useEffect(() => {
    main()
}, [language, user, query, variables, endpoint_url,user?.accessToken?.access_token])

return (
    <section className='codesnippet__root'>
        <div>
            <div className="doc-explorer-title">Code snippet</div>
            <p className="alert alert-warning" role="alert" style={{textIndent: '15px'}}> You HAVE TO replace the
                token with the token generated for your application with large enough
                lifetime OR use the code to refresh the token (
                <a href='https://docs.bitquery.io/docs/category/authorization/' target="_blank" rel="noopener noreferrer"
                   title='Go to docs.bitquery.io'>documentation</a>
                ).
            </p>
        </div>
        <div className="options flex">
            <div className="navbar-collapse mr-auto" id="navbarCodeSnippet">
                <ul className={'navbar-nav mr-auto'}>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle"
                           href="# "
                           id="navbarDropdown"
                           role="button"
                           data-toggle="dropdown"
                           aria-haspopup="true"
                           aria-expanded="false"
                        >
                            {`${language.label}`} {language.variant !== language.label && ` - ${language.variant}`}
                        </a>
                        <div className="dropdown-menu" disabled>
                            {languageList.map(item => item.variants.map(({key}, i) => (
                                <a className="dropdown-item" href="# " key={key}
                                   onClick={() => setLanguage({...item, variant: key})}>
                                    {item.label} {key !== item.key && ` - ${key}`}
                                </a>
                            )))}
                        </div>
                    </li>
                </ul>
            </div>
            <div className="buttons">
                <i className="bi bi-back" onClick={handleCopy}/>
            </div>
        </div>
        <div className='card'>
            {!query.startsWith('subscription') ? (
                <RawCodeMirror mode={language.syntax_mode} value={snippet}/>
            ) : (
                <p className="alert alert-warning" role="alert" style={{textIndent: '15px'}}>
                    Our Code snippet doesn`t generate code for subscription, you should do it yourself (
                    <a href='https://docs.bitquery.io/docs/subscriptions/examples/' target="_blank" rel="noopener noreferrer"
                       title='Go to docs.bitquery.io'>documentation</a>
                    )
                </p>
            )}
        </div>

    </section>
)
})

export default CodeSnippetComponent