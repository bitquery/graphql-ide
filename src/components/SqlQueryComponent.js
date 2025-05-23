import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const SqlQueryComponent = observer(function SqlQueryComponent({ sqlQuery = {} }) {
    const [copied, setCopied] = useState(false);
    const sqlStatements = Array.isArray(sqlQuery.Sql) ? sqlQuery.Sql : [];
    const sqlText = sqlStatements.join('\n\n');

    const copySql = () => {
        if (!sqlText) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(sqlText)
                .then(() => setCopied(true))
                .catch(() => {});
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = sqlText;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (success) setCopied(true);
        }
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const debugData = { ...sqlQuery };

    return (
        <section className="codesnippet__root">
            <div className="doc-explorer-title d-flex align-items-center">
                <span className='me-3'>Debug Info</span>
                <i
                    className="bi bi-save bitquery-btn"
                    style={{ cursor: sqlText ? 'pointer' : 'not-allowed' }}
                    title={sqlText ? 'Copy SQL to clipboard' : 'No SQL to copy'}
                    onClick={copySql}
                />
                {copied && (
                    <span className="ms-2 text-success" role="status">
                        SQL copied!
                    </span>
                )}
            </div>

            <div className="card" style={{ overflowY: 'auto' }}>
                <CodeMirror
                    value={JSON.stringify(debugData, null, 2)}
                    options={{
                        mode: 'application/json',
                        lineWrapping: true,
                        lineNumbers: false,
                        readOnly: true,
                        matchBrackets: true,
                    }}
                    onBeforeChange={() => { }}
                />
            </div>
        </section>
    );
});

export default SqlQueryComponent;
