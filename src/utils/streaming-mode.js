import { list, t, onlineParser, p, } from 'graphql-language-service'
import CodeMirror from 'codemirror'

CodeMirror.defineMode('graphql-results-streaming', config => {
	const parser = onlineParser({
		eatWhitespace: stream => stream.eatSpace(),
		lexRules: LexRules,
		parseRules: ParseRules,
		editorConfig: { tabSize: config.tabSize },
	});
	return {
		config,
		startState: parser.startState,
		token: parser.token,
		indent,
		electricInput: /^\s*[}\]]/,
		fold: 'brace',
		closeBrackets: {
			pairs: '[]{}""',
			explode: '[]{}',
		},
	};
});
function indent(state, textAfter) {
	var _a, _b;
	const levels = state.levels;
	const level = !levels || levels.length === 0
		? state.indentLevel
		: levels[levels.length - 1] -
		(((_a = this.electricInput) === null || _a === void 0 ? void 0 : _a.test(textAfter)) ? 1 : 0);
	return (level || 0) * (((_b = this.config) === null || _b === void 0 ? void 0 : _b.indentUnit) || 0);
}
const LexRules = {
	Punctuation: /^\[|]|\{|\}|:|,/,
	Number: /^-?(?:0|(?:[1-9][0-9]*))(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?/,
	String: /^"(?:[^"\\]|\\(?:"|\/|\\|b|f|n|r|t|u[0-9a-fA-F]{4}))*"?/,
	Keyword: /^true|false|null/,
	Timer: /^(?:[^"\\]|\\(?:"|\/|\\|b|f|n|r|t|u[0-9a-fA-F]{4}))*?$/
};
const ParseRules = {
	Document: [list('TimePart')],
	TimePart: [t('Timer', 'def'), p('{'), list('Entry', p(',')), p('}')],
	Entry: [t('String', 'def'), p(':'), 'Value'],
	Value(token) {
		switch (token.kind) {
			case 'Number':
				return 'NumberValue';
			case 'String':
				return 'StringValue';
			case 'Punctuation':
				switch (token.value) {
					case '[':
						return 'ListValue';
					case '{':
						return 'ObjectValue';
				}
				return null;
			case 'Keyword':
				switch (token.value) {
					case 'true':
					case 'false':
						return 'BooleanValue';
					case 'null':
						return 'NullValue';
				}
				return null;
		}
	},
	NumberValue: [t('Number', 'number')],
	StringValue: [t('String', 'string')],
	BooleanValue: [t('Keyword', 'builtin')],
	NullValue: [t('Keyword', 'keyword')],
	ListValue: [p('['), list('Value', p(',')), p(']')],
	ObjectValue: [p('{'), list('ObjectField', p(',')), p('}')],
	ObjectField: [t('String', 'property'), p(':'), 'Value'],
};