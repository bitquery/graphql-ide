import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import {getTagsList} from "../../api/api"
import {GalleryStore} from '../../store/galleryStore'
import {QueriesStore, TabsStore} from '../../store/queriesStore'
import {UserStore} from '../../store/queriesStore'
import {makeDefaultArg, getDefaultScalarArgValue} from "./QueryBuilder/CustomArgs"
import QueryBuilder from '../Gallery/QueryBuilder/index'
import GPTChat from "../GPTChat";

const NewGallery = observer(function NewGallery() {
    const {user} = UserStore
    const {
        queriesListIsOpen, currentTag, toggleQueriesList, setCurrentTag
    } = GalleryStore
    const {currentQuery, updateQuery, schema, queryJustSaved} = QueriesStore
    const {index} = TabsStore
    const [tagsList, setTagsList] = useState([])
    const [showBuilder, toggleBuilder] = useState(false)
    const [activeTab, setActiveTab] = useState('Builder')
    const [savedCode, setSavedCode] = useState('')
    const [width, setWidth] = useState(300);
    const handleMouseMove = (e) => {
        const newWidth = e.clientX;
        if (newWidth > 100 && newWidth < window.innerWidth - 100) {
            setWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('newGallery__resizer')) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };

    useEffect(() => {
        const onload = async () => {
            try {
                const {data} = await getTagsList('explore')
                setTagsList(data)
            } catch (error) {
                console.log(error)
            }
        }
        user && onload()
    }, [queryJustSaved, user])

    const handleClick = tag => {
        setCurrentTag(tag)
        if (queriesListIsOpen && tag === currentTag || !queriesListIsOpen) {
            toggleQueriesList()
        }
    }
    const handleSaveCode = (code) => {
        setSavedCode(code);
        updateQuery({ query: code }, index)
    };
    return (
        <div className="newGallery__root" style={{width}}>
            <div className="newGallery__resizer" onMouseDown={handleMouseDown}></div>
            <div className="newGallery__topbar">
                  <span
                      className={`bitquery-btn ${activeTab === 'Builder' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Builder')}
                  >
                    Builder
                  </span>
                {user?.role === 'admin' &&
                    <span
                        className={`bitquery-btn ${activeTab === 'GPT' ? 'active' : ''}`}
                        onClick={() => setActiveTab('GPT')}
                    >
                    GPT chat only for admin
                  </span>
                }
            </div>
            {activeTab === 'Builder' && (
                <QueryBuilder
                    width={'300px'}
                    minWidth={'300px'}
                    title={'Builder'}
                    schema={schema[currentQuery.endpoint_url]}
                    query={currentQuery.query}
                    user={user}
                    onEdit={query => updateQuery({query}, index)}
                    explorerIsOpen={true}
                    getDefaultScalarArgValue={getDefaultScalarArgValue}
                    makeDefaultArg={makeDefaultArg}
                />
            )}
            {activeTab === 'GPT' && <GPTChat onSaveCode={handleSaveCode} initialQuery={currentQuery.query}/>}
        </div>

    )
})

export default NewGallery
