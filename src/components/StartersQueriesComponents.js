import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { QueriesStore} from '../store/queriesStore';
import modalStore from '../store/modalStore';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const STARTER_QUERIES_URL =
    'https://raw.githubusercontent.com/bitquery/streaming-data-platform-docs/refs/heads/main/docs/start/starter-queries.md';
const STARTER_SUBSCRIPTIONS_URL =
    'https://raw.githubusercontent.com/bitquery/streaming-data-platform-docs/refs/heads/main/docs/start/starter-subscriptions.md';

function parseMarkdownHeadings(md) {
    const tree = [];
    let currentSection = null;
    let currentItem = null;
    let readingDescription = false;

    md.split('\n').forEach(line => {
        if (line.startsWith('## ')) {
            const sectionTitle = line.slice(3).trim();
            if (
                sectionTitle !== 'Table of Contents' &&
                sectionTitle !== 'More APIs' &&
                sectionTitle !== 'More on Streams'
            ) {
                currentSection = { title: sectionTitle, children: [] };
                tree.push(currentSection);
            } else currentSection = null;
            readingDescription = false;
            currentItem = null;
        } else if (currentSection && line.startsWith('### ')) {
            currentItem = { title: line.slice(4).trim(), description: '', url: '' };
            currentSection.children.push(currentItem);
            readingDescription = true;
        } else if (readingDescription && currentItem) {
            const text = line.trim();
            if (/^[▶►]/.test(text)) {
                const match = text.match(/\[(.+?)\]\((.+?)\)/);
                if (match) currentItem.url = match[2];
                readingDescription = false;
                currentItem = null;
            } else if (text) {
                currentItem.description += (currentItem.description ? ' ' : '') + text;
            }
        }
    });
    return tree;
}

function useMarkdownTree(url) {
    const [tree, setTree] = useState([]);
    useEffect(() => {
        let isMounted = true;
        fetch(url)
            .then(res => (res.ok ? res.text() : Promise.reject(res.status)))
            .then(text => isMounted && setTree(parseMarkdownHeadings(text)))
            .catch(() => isMounted && setTree([]));
        return () => {
            isMounted = false;
        };
    }, [url]);
    return tree;
}

const StartersQueriesComponents = observer(() => {
    const history = useHistory();
    const {openOrSwitch } = QueriesStore;
    const { toggleStartersQueriesModal } = modalStore
    const [activeTab, setActiveTab] = useState('queries');
    const queriesTree = useMarkdownTree(STARTER_QUERIES_URL);
    const subsTree = useMarkdownTree(STARTER_SUBSCRIPTIONS_URL);
    const [expandedKey, setExpandedKey] = useState(null);

    const toggleSection = useCallback((tab, index) => {
        const key = `${tab}-${index}`;
        setExpandedKey(prev => (prev === key ? null : key));
    }, []);

    const extractId = url => url.split('/').pop();

    const handleItemClick = useCallback(
        async (url, title) => {
            const id = extractId(url);
            if (!id) return;
            await openOrSwitch(id, { id, url: id, name: title });
            history.push(`/${id}`);
            toggleStartersQueriesModal();
        },
        [history, toggleStartersQueriesModal]
    );


    const renderTree = (tree, tabKey) => (
        <ul className="tree-root">
            {tree.map((section, idx) => {
                const key = `${tabKey}-${idx}`;
                const isOpen = expandedKey === key;
                return (
                    <li key={key} className="tree-section">
                        <div className={`tree-node ${isOpen ? 'node-open' : ''}`} onClick={() => toggleSection(tabKey, idx)}>
                            {section.children.length > 0 && (
                                <span className="tree-toggle">{isOpen ? '▾' : '▸'}</span>
                            )}
                            {section.title}
                        </div>
                        {isOpen && (
                            <ul className="tree-children">
                                {section.children.map((item, j) => {
                                    const tipId = `tooltip-${tabKey}-${idx}-${j}`;
                                    return (
                                        <li key={`${key}-${j}`} className="tree-child">
                                            <OverlayTrigger
                                                placement="bottom"
                                                delay={{ show: 250, hide: 100 }}
                                                overlay={<Tooltip id={tipId}>{item.description}</Tooltip>}
                                            >
                        <span
                            className="child-link"
                            onClick={() => handleItemClick(item.url, item.title)}
                        ><i className="bi bi-terminal me-2"></i>
                          {item.title}
                        </span>
                                            </OverlayTrigger>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <section className='mx-3'>
            <div className="px-2 pb-2">
                <div className="btn-group" role="group" aria-label="Starter toggle">
                    {['queries', 'subscriptions'].map(tab => (
                        <React.Fragment key={tab}>
                            <input
                                type="radio"
                                className="btn-check"
                                name="starterToggle"
                                id={`toggle-${tab}`}
                                autoComplete="off"
                                checked={activeTab === tab}
                                onChange={() => setActiveTab(tab)}
                            />
                            <label
                                className="btn tree-btn"
                                htmlFor={`toggle-${tab}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </label>
                        </React.Fragment>
                    ))}
                </div>

            </div>

            <div className="query-container ">
                {activeTab === 'queries'
                    ? renderTree(queriesTree, 'queries')
                    : renderTree(subsTree, 'subscriptions')}
            </div>
        </section>
    );
});

StartersQueriesComponents.propTypes = {};

export default StartersQueriesComponents;
