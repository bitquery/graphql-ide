import { observer } from 'mobx-react-lite'
import { QueriesStore, UserStore, TabsStore } from '../../../store/queriesStore'
import { copyQuery } from '../../../api/api'
import modalStore from '../../../store/modalStore'
import { toast } from 'react-toastify'
import { parse as parseGql } from 'graphql/language'
import { print } from 'graphql'
import React, { useState, useEffect } from 'react'
import StatisticsButton from './StatisticsButton'
import { GalleryStore } from '../../../store/galleryStore'
import ToolbarButton from './ToolbarButton'
import copy from 'copy-to-clipboard'
import { Form, InputGroup } from 'react-bootstrap'
import DocsIcon from '../../icons/DocsIcon'
import SqlIcon from '../../icons/SqlIcon'
import ChatBubbleComponent from "../../ChatBubbleComponent";

const ToolbarComponent = observer(({
                                       queryEditor,
                                       variablesEditor,
                                       headersEditor,
                                       docExplorerOpen,
                                       toggleDocExplorer,
                                       toggleCodeSnippet,
                                       toggleSqlQuery,
                                       sqlQueryOpen,
                                       codeSnippetOpen,
                                       number
                                   }) => {
    const {
        currentQuery, updateQuery, setQuery,
        queryIsTransfered, setQueryIsTransfered, queryJustSaved, query
    } = QueriesStore
    const { tagListIsOpen, toggleTagsList } = GalleryStore
    const { index } = TabsStore
    const { user } = UserStore
    const { toggleModal, toggleEditDialog } = modalStore
    const [mode, setMode] = useState(false)
    const [dashboardOwner, setOwner] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState('')

    useEffect(() => {
        if (((currentQuery.layout && (currentQuery.account_id === user?.id)) || !currentQuery.id) || !currentQuery.layout) {
            setOwner(true)
        } else {
            setOwner(false)
        }
        // eslint-disable-next-line
    }, [user, JSON.stringify(currentQuery)])

    useEffect(() => {
        switch (currentQuery.endpoint_url) {
            case 'https://graphql.bitquery.io':
                setSelectedUrl('https://graphql.bitquery.io')
                break
            case 'https://streaming.bitquery.io/graphql':
                setSelectedUrl('https://streaming.bitquery.io/graphql')
                break
            case 'https://streaming.bitquery.io/eap':
                setSelectedUrl('https://streaming.bitquery.io/eap')
                break
            default:
                setSelectedUrl('')
                break
        }
    }, [currentQuery.endpoint_url])

    const handleInputURLChange = e => {
        updateQuery({ endpoint_url: e.target.value }, index)
    }
    const handleDropdownSelect = (url) => {
        updateQuery({ endpoint_url: url }, index)
        setSelectedUrl(url)
    }

    const switchMode = () => {
        setMode(!mode)
        updateQuery({ isDraggable: !currentQuery.isDraggable, isResizable: !currentQuery.isResizable }, index)
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

        const headerEditor = headersEditor.current.getEditor()
        const headerEditorContent = headerEditor?.getValue() ?? ''
        try {
            const prettifiedVariableEditorContent = JSON.stringify(
                JSON.parse(variableEditorContent),
                null,
                2,
            )
            const prettifiedHeaderEditorContent = JSON.stringify(
                JSON.parse(headerEditorContent),
                null,
                2,
            )

            if (prettifiedHeaderEditorContent !== headerEditorContent) {
                headerEditor.setValue(prettifiedHeaderEditorContent)
            }

            if (prettifiedVariableEditorContent !== variableEditorContent) {
                variableEditor.setValue(prettifiedVariableEditorContent)
            }
        } catch {
            // если JSON невалиден, ничего не делаем
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
        if (!currentQuery || !currentQuery.query) {
            toast('Cannot fork: Query data is not fully loaded.', { type: 'error' });
            return
        }
        setQuery({
            ...currentQuery,
            id: null,
            account_id: null,
            headers: currentQuery.headers,
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
                },
                headers: currentQuery.headers,
            })
            link = data
        } else {
            link = `${window.location.protocol}//${window.location.host}/${currentQuery.url}`
        }
        copy(link)
        toast('Link copied to clipboard', { type: 'success' })
    }

    const toolbar = <div className="topBarWrap">
        <ChatBubbleComponent endpoint_url={currentQuery?.endpoint_url} />
        <div className="topBar">
            {!tagListIsOpen && <i className="bi bi-chevron-double-right cursor-pointer ml-2" onClick={toggleTagsList} />}
            {dashboardOwner && !(!currentQuery.id || !currentQuery.saved) && currentQuery.layout &&
                <button type="button" className="topBar__button" onClick={switchMode}>Edit</button>}
            {user?.id && <ToolbarButton
                className='bitquery-btn'
                aria-labelledby={currentQuery.id}
                title='Save'
                onClick={() => {
                    toggleModal();
                    toggleEditDialog();
                }}
                visible={((currentQuery.account_id === user?.id) || (!currentQuery.id && !currentQuery.account_id)) && !(!!currentQuery?.url && !!currentQuery.id)}
            />}
            {!currentQuery.saved && currentQuery.layout &&
                <button type="button" className="topBar__button bitquery-btn" onClick={cancelHandle}>Cancel</button>}
            {dashboardOwner && currentQuery.layout &&
                <div
                    className="grid-stack-item droppable-element"
                    draggable={true}
                    unselectable="on"
                    style={{ border: '1px dashed #c0c0c0', padding: '3px' }}
                    onDragStart={e => e.dataTransfer.setData("text/plain", "block.content")}
                >Text Block</div>}

            {(currentQuery?.url && currentQuery.id)
                ? null
                : <ToolbarButton
                    className='bitquery-btn'
                    title='Prettify'
                    onClick={prettifyQuery}
                />}
            <ToolbarButton
                className='bitquery-btn'
                title='Fork'
                onClick={handleFork}
                visible={currentQuery && currentQuery.query}
            />
            {queryJustSaved || currentQuery.url && <ToolbarButton
                title='Copy query URL'
                onClick={handleCopy}
                visible={!!currentQuery.graphqlQueryID || !!currentQuery.url}
            />}
            <InputGroup className="input-group-fix bitquery-inputUrl">
                    <Form.Control
                        as="select"
                        onChange={e => handleDropdownSelect(e.target.value)}
                        value={selectedUrl}
                        className="drop-down-fix"
                    >
                        <option value="https://graphql.bitquery.io">API v1</option>
                        <option value="https://streaming.bitquery.io/graphql">API v2</option>
                        <option value="https://streaming.bitquery.io/eap">EAP</option>
                        <option value="">Other...</option>
                    </Form.Control>
                <Form.Control
                    id="basic-url"
                    aria-label="endpoint-url"
                    value={currentQuery.endpoint_url}
                    onChange={handleInputURLChange}
                    className="input-url-fix"
                />
            </InputGroup>
            {user?.id && query[number].graphqlQueryID && <StatisticsButton number={number} />}
            {user?.role === 'admin' &&
                <span aria-label="SQL Query" onClick={toggleSqlQuery}>
          <SqlIcon
              className={"bitquery-little-btn" + (sqlQueryOpen ? " active" : '')}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="SQL Query"
          />
        </span>}
            <span aria-label="Documentation Explorer" onClick={toggleDocExplorer}>
        <DocsIcon
            className={"bitquery-little-btn" + (docExplorerOpen ? " active" : '')}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Documentation Explorer"
        />
      </span>
            <span className="d-flex align-items-center justify-content-center bitquery-little-btn"
                  aria-label="Code Snippet" onClick={toggleCodeSnippet}>
        <i className={"bi bi-code-slash" + (codeSnippetOpen ? " active" : '')} />
      </span>
        </div>
    </div>

    return toolbar
})

export default ToolbarComponent
