import React, {useEffect, useState, useRef} from 'react'
import {observer} from 'mobx-react'
import {getTaggedQueriesList, getSearchResults} from '../../api/api'
import {GalleryStore} from '../../store/galleryStore'
import {QueriesStore, TabsStore} from '../../store/queriesStore'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {useQuery} from '../../utils/useQuery'

const QueriesList = observer(function QueriesList() {

    const {currentTag} = GalleryStore
    const {
        setQuery, query, currentPage, queriesOnPage,
        setCurrentPage, setSearchValue
    } = QueriesStore
    const {switchTab, tabs} = TabsStore

    const history = useHistory()
    const location = useLocation()
    const {tag} = useParams()
    const searchQuery = useQuery()

    const [list, setList] = useState([])
    const [thereIsNext, setNext] = useState(false)

    const prevSearchParams = useRef({search: '', pathname: ''})

    // При загрузке компонента сохраняем значение ?search= в QueriesStore
    useEffect(() => {
        const search = searchQuery.get('search')
        if (search) {
            setSearchValue(search)
        }
    }, [searchQuery, setSearchValue])

    const main = async (page) => {
        const queryListType = location.pathname.match(/[a-zA-Z]+/gm)[0]
        const { data } = await getTaggedQueriesList(currentTag, page * queriesOnPage, queryListType)
        data.length > queriesOnPage ? setNext(true) : setNext(false)
        setList(data)
    }

    // Следим за изменением URL и поискового параметра
    useEffect(() => {
        const main = async () => {
            const search = searchQuery.get('search')
            const pathname = location.pathname

            // Если изменился поисковый запрос или путь
            if (search !== prevSearchParams.current.search || pathname !== prevSearchParams.current.pathname) {
                if (!search) {
                    // Нет поискового запроса — получаем список по тегу
                    const queryListType = location.pathname.match(/[a-zA-Z]+/gm)[0]
                    const {data} = await getTaggedQueriesList(currentTag, currentPage * queriesOnPage, queryListType)
                    data.length > queriesOnPage ? setNext(true) : setNext(false)
                    setList(data)
                } else {
                    // Есть поисковый запрос — делаем поиск
                    setNext(false)
                    setCurrentPage(0)
                    const {data} = await getSearchResults(search)
                    history.push(`/explore/All%20queries?search=${search}`)
                    setList(data)
                }
                prevSearchParams.current = {search, pathname}
            }
        }
        main()
    }, [
        searchQuery, location.pathname, currentTag, currentPage, queriesOnPage,
        history, setCurrentPage
    ])

    // Открыть запрос в новой (или существующей) вкладке
    const handleClick = (queryFromGallery) => {
        const existingIndex = query.findIndex(q => q.id === queryFromGallery.id)
        if (existingIndex === -1) {
            // Добавляем запрос в список вкладок
            setQuery(queryFromGallery, queryFromGallery.id)
        } else {
            // Переключаемся на существующую вкладку
            switchTab(tabs[existingIndex].id)
        }
        history.push(`/${queryFromGallery.url || ''}`)
    }

    const nextPage = () => {
        if (thereIsNext) {
            main(currentPage + 1)
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            main(currentPage - 1)
            setCurrentPage(currentPage - 1)
        }
    }

    return (
        <div
            className="col-lg-9 bitquery-querylist-container mb-5"
            style={{ marginBottom: '15px', fontSize:'0.9rem'}}
            aria-label="list of public queries"
        >
            <ul className="list-group bitquery-querylist" role="list" tabIndex={0}>
                {list && list.map((item, i, arr) => {
                    if (arr.length <= queriesOnPage || i + 1 !== arr.length) {
                        return (
                            <li
                                key={item.id}
                                className="list-group-item p-0 border-0 mb-1"
                                style={{cursor: 'pointer'}}
                            >
                                <div
                                    className="card h-100"
                                    onClick={() => handleClick(item)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h6 className="card-title mb-0">
                                                {item.name}
                                            </h6>
                                            {item.cnt && (
                                                <span className="bitquery-teg-color badge-pill">
                                                    <i className="bi bi-eye" /> {item.cnt}
                                                </span>
                                            )}
                                        </div>

                                        {typeof item.tags === 'string' && (
                                            <div className="mt-1">
                                                {item.tags.split(',').map(tag => (
                                                    <span key={tag} className="bitquery-teg mr-2">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {item.description && (
                                            <p className="card-text mt-2 mb-1">
                                                {item.description}.
                                            </p>
                                        )}

                                        <small className="text-muted">
                                            Created by: <strong>{item.owner_name}</strong> ·{' '}
                                            {Math.floor(
                                                (new Date().getTime() - new Date(item.created_at).getTime()) /
                                                (1000 * 60 * 60 * 24)
                                            )}{' '}
                                            days ago
                                        </small>
                                    </div>
                                </div>
                            </li>
                        )
                    }
                })}
            </ul>

            {/* Пагинация */}
            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                    <li
                        className={`page-item mr-2 ${!currentPage ? 'disabled' : ''}`}
                        onClick={prevPage}
                    >
                        <a
                            className="page-link bitquery-little-btn d-flex align-items-center p-0 m-0 justify-content-center"
                            aria-label="previous page"
                        >
                            &larr;
                        </a>
                    </li>
                    <li
                        className={`page-item ${!thereIsNext ? 'disabled' : ''}`}
                        onClick={nextPage}
                    >
                        <a
                            className="page-link bitquery-little-btn d-flex align-items-center p-0 m-0 justify-content-center"
                            href="#"
                            aria-label="next page"
                        >
                            &rarr;
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
})

export default QueriesList
