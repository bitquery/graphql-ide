export function formatGraphQLErrors(errors) {
    if (!Array.isArray(errors) || errors.length === 0) {
        return 'Unknown GraphQL error';
    }

    const parts = errors.map(err => {
        const message = typeof err?.message === 'string' ? err.message : 'GraphQL error';
        const path = Array.isArray(err?.path) ? err.path.join(' → ') : undefined;
        const loc = Array.isArray(err?.locations) && err.locations[0]
            ? `Line ${err.locations[0].line}, Column ${err.locations[0].column}`
            : undefined;

        const code = err?.extensions?.code;
        const typeName = err?.extensions?.typeName;
        const fieldName = err?.extensions?.fieldName;

        let friendly = message;

        if (code === 'undefinedField') {
            if (typeName === 'Query') {
                friendly = `${message}. This might be a wrong endpoint for this query. Check correct endpoints here https://docs.bitquery.io/docs/start/endpoints/`;
            } else if (fieldName && typeName) {
                friendly = `Field "${fieldName}" does not exist on type "${typeName}". Please check your query.`;
            }
        }

        const ctx = [path && `Path: ${path}`, loc && `Location: ${loc}`].filter(Boolean).join(' | ');
        return ctx ? `${friendly} (${ctx})` : friendly;
    });

    return parts.join('\n');
}


