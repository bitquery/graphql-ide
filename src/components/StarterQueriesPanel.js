import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { QueriesStore, TabsStore, UserStore } from '../store/queriesStore';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getQuery } from '../api/api';
import { toast } from 'react-toastify';

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

const StarterQueriesPanel = observer(({ type }) => {
    const history = useHistory();
    const { updateQuery } = QueriesStore;
    const { index } = TabsStore;
    const { user } = UserStore;
    const url = type === 'queries' ? STARTER_QUERIES_URL : STARTER_SUBSCRIPTIONS_URL;
    const tree = useMarkdownTree(url);
    const [expandedKey, setExpandedKey] = useState(null);

    const toggleSection = useCallback((index) => {
        const key = `${type}-${index}`;
        setExpandedKey(prev => (prev === key ? null : key));
    }, [type]);

    const extractId = url => url.split('/').pop();

    const handleItemClick = useCallback(
        async (url, title) => {
            const id = extractId(url);
            if (!id) return;
            try {
                const { data } = await getQuery(id);
                updateQuery({
                    ...data,
                    isOwner: data.account_id === user?.id,
                    saved: true
                }, index, data.id);
                history.push(`/${id}`);
            } catch (e) {
                console.error(e);
                toast.error('Error opening query');
            }
        },
        [history, updateQuery, index, user]
    );

    const renderTree = (treeToRender) => (
        <ul className="tree-root">
            {treeToRender.map((section, idx) => {
                const key = `${type}-${idx}`;
                const isOpen = expandedKey === key;
                return (
                    <li key={key} className="tree-section">
                        <div className={`tree-node ${isOpen ? 'node-open' : ''}`} onClick={() => toggleSection(idx)}>
                            {section.children.length > 0 && (
                                <span className="tree-toggle">{isOpen ? '▾' : '▸'}</span>
                            )}
                            {section.title}
                        </div>
                        {isOpen && (
                            <ul className="tree-children">
                                {section.children.map((item, j) => {
                                    const tipId = `tooltip-${type}-${idx}-${j}`;
                                    return (
                                        <li key={`${key}-${j}`} className="tree-child"
                                            onClick={() => handleItemClick(item.url, item.title)}
                                        >
                                            <OverlayTrigger
                                                placement="bottom"
                                                delay={{ show: 250, hide: 100 }}
                                                overlay={<Tooltip id={tipId}>{item.description}</Tooltip>}
                                            >
                        <span
                            className="child-link"
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
        <section className='starter-panel-container'>
            <div className="query-container ">
                {renderTree(tree)}
            </div>
        </section>
    );
});

export default StarterQueriesPanel; 