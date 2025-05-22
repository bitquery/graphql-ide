import React from 'react';
import { observer } from 'mobx-react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const SqlQueryComponent = observer(function SqlQueryComponent({ sqlQuery = {} }) {
    const sqlStatements = Array.isArray(sqlQuery.Sql) ? sqlQuery.Sql : [];
    const sqlText = sqlStatements.join('\n\n');

    const copySql = () => {
        if (!sqlText) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(sqlText);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = sqlText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    };

    const debugData = { ...sqlQuery };

    return (
        <section className="codesnippet__root">
            <div
                className="doc-explorer-title"
            >
                <span className='me-5'>Debug Info</span>
                <i
                    className="bi bi-save bitquery-btn"
                    style={{ cursor: sqlText ? 'pointer' : 'not-allowed' }}
                    title={sqlText ? 'Copy SQL to clipboard' : 'No SQL to copy'}
                    onClick={copySql}
                />
            </div>

                <div className="card" style={{  overflowY:'auto'}}>
                    <CodeMirror
                        value={JSON.stringify(debugData, null, 2)}
                        options={{
                            mode: 'application/json',
                            lineWrapping: true,
                            lineNumbers: false,
                            readOnly: true,
                            matchBrackets: true,
                        }}
                        onBeforeChange={() => {}}
                    />
            </div>
        </section>
    );
});

export default SqlQueryComponent;
