<template>
	<div class="main">
		<div id="graphiql"></div>
	</div>
</template>

<script>
import renderGraphiQL from '../GraphiQL'
// @ is an alias to /src
export default {
	name: 'Main',
	data() {
		return {
			gqlquery: ''
		}
	},
	methods: {
		async fetcher(graphQLParams) {
			this.gqlparams = graphQLParams.query
			const data = await fetch(
				'https://graphql.bitquery.io',
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(graphQLParams),
					credentials: 'same-origin'
				}
			)
			return data.json().catch(() => data.text())
		}
	},
	mounted() {
		renderGraphiQL(this.fetcher)
	}
}
</script>
<style lang="scss">
.main {
	height: 100vh;
	display: flex;
}
#graphiql {
	min-width: 100%;
}
.CodeMirror-line {
	text-align: left;
}
</style>
