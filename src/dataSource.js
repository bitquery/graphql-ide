const getValueFrom = (o, s) => {
    s = s.replace(/\[(\w+)\]/g, '.$1'); 
    s = s.replace(/^\./, '');           
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

export class dataSource {
	constructor(query, variables, displayed_data) {
		this.query = query
		this.variables = variables
		this.displayed_data = displayed_data
	}
	setupErrors(json) {
		return ('errors' in json) ? json.errors : null
	}
	setupData(json) {
		return ('data' in json) ? getValueFrom(json.data, this.displayed_data) : null
	}
	fetcher(key) {
		let keyHeader = {'X-API-KEY': key}
		return fetch(
			'https://graphql.bitquery.io',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					...keyHeader
				},
				body: JSON.stringify({query: this.query, variables: this.variables}),
				credentials: 'same-origin',
			},
		)
	}
}