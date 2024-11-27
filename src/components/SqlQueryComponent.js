import { observer } from 'mobx-react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/sql/sql';
import 'codemirror-graphql/mode';

const SqlQueryComponent = observer(function SqlQueryComponent({ sqlQuery }) {

    return (
        <section className="codesnippet__root">
            <div>
                <div className="doc-explorer-title">SQL Query</div>

            </div>
            <div className="card">
                <div className="query-container" style={{ position: 'relative' }}>
                    <CodeMirror
                        value={sqlQuery || '-- No SQL Query provided --'}
                        options={{
                            mode: 'sql',
                            lineWrapping: true,
                            lineNumbers: false,
                            readOnly: true,
                            matchBrackets: true,
                            autoCloseBrackets: true,
                        }}
                        onBeforeChange={() => {}}
                    />
                </div>
            </div>
        </section>
    );
});

export default SqlQueryComponent;
