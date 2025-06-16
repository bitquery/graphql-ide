import React, { useState, useEffect, useCallback } from 'react'
import './App.scss'
import ModalWindow from './components/modal/ModalWindow'
import ControlPanel from './components/ControlPanel'
import {Route, Switch} from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import {QueriesStore} from './store/queriesStore'
import {GraphqlExplorer} from './components/GraphqlExplorer'
import {observer} from 'mobx-react-lite'
import NewGallery from "./components/Gallery/NewGallery"
import {GalleryStore} from './store/galleryStore'
import TabsComponent from './components/TabsComponent'
import ExploreComponent from './components/ExploreComponent'
import {TokenPagesAPI} from './components/TokenPagesAPI'
import {ToastContainer, toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import PromoBanner from "./components/bitqueditor/components/PromoBanner";
import '@fortawesome/fontawesome-free/css/all.min.css';


if (process.env.NODE_ENV === 'development') {
    /* require('@welldone-software/why-did-you-render')(React, {
      trackAllPureComponents: true,
      exclude: [/^Explorer/, /^RootView/,
        /^FieldView/, /^ArgView/,
        /^AbstractArgView/, /^InputArgView/,
        /^AbstractArgView/, /^ScalarInput/]
    }); */
}

const App = observer(function App() {
    const {query, showSideBar} = QueriesStore
    const {tagListIsOpen} = GalleryStore
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (isResizing) {
            setSidebarWidth(prevWidth => {
                const newWidth = prevWidth + e.movementX;
                if (newWidth > 200 && newWidth < 800) { // Min and max width constraints
                    return newWidth;
                }
                return prevWidth;
            });
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        const handleUnload = e => {
            for (let i = 0; i < query.length; i++) {
                if ('saved' in query[i] && !query[i].saved) {
                    e.preventDefault()
                    e.returnValue = ''
                }
            }
        }
        window.addEventListener('beforeunload', handleUnload)
        return () => {
            window.removeEventListener('beforeunload', handleUnload)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="App">
            <ControlPanel/>
            <ToastContainer
                position={toast.POSITION.TOP_RIGHT}
            />
            <ModalWindow/>
            <Switch>
                <Route path='/reset'>
                    <ResetPassword/>
                </Route>
                <Route path='/exploreapi/:symbol/:address'>
                    <TokenPagesAPI/>
                </Route>
                <Route path={[
                    '/explore',
                    '/myqueries',
                    '/team'
                ]}>
                    <ExploreComponent/>
                </Route>
                <Route path={['/:queryurl', '/']}>
                    <TabsComponent/>
                    <div className="content flex">
                        {tagListIsOpen && (
                            <>
                                <div style={{ width: `${sidebarWidth}px` }}>
                                    <NewGallery />
                                </div>
                                <div
                                    className="resizer"
                                    onMouseDown={handleMouseDown}
                                />
                            </>
                        )}
                        <GraphqlExplorer/>
                    </div>
                </Route>
            </Switch>
            <PromoBanner/>

        </div>
    )
})

export default App;
