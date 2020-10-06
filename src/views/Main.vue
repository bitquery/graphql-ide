<template>
	<div class="main">
		<div class="tabs">
			<ul>
				<li
					v-for="(tab, index) in tabs" :key="tab"
					:class="{'active': currentTab === tab}"
					@click="currentTab = tab"
				>
					{{tab}}
					<span class="tab__close" @click.stop="removeTab(index)">❌</span>
				</li>
				<li @click="addNewTab" >+</li>
			</ul>
		</div>
		<graphiql 
			v-for="tab in tabs" :key="tab"
			:class="['giql__wrapper', {'giql__wrapper_active': currentTab === tab} ]"
			:fetcher="fetcher" 
		/>
	</div>
</template>

<script>
import graphiql from 'graphiql'
export default {
	name: 'Main',
	components: {
		graphiql
	},
	data() {
		return {
			gqlquery: '',
			currentTab: '1',
			tabs: ['1']
		}
	},
	computed: {
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
		},
		addNewTab() {
			this.tabs.push((+this.tabs[this.tabs.length-1]+1) || '1')
			this.currentTab = this.tabs[this.tabs.length-1]
		},
		removeTab(index) {
			this.tabs.splice(index, 1)
			this.tabs.length === 0 && this.addNewTab()
			this.currentTab = this.tabs[index+1] || this.tabs[0] || '1'
		}
	}
}
</script>
<style lang="scss">
.main {
	height: 100vh;
	display: flex;
	flex-direction: column;
}
#graphiql {
	min-height: 100%;
}
.CodeMirror-line {
	text-align: left;
}
.giql__wrapper {
	min-height: 100%;
	display: none;
	&_active {
		display: block;
	}
}
.tab {
	&__close{
		padding-left: 10px;
	}
}
.tabs {
	ul {
		display: flex;
		list-style: none;
		margin-bottom: 0;
		li {
			display: block;
			cursor: pointer;
			padding: 20px;
			margin: 0 10px;
			background-color: #d1d1d1;
			&:hover, &.active {
				background-color: #f7f7f7;
			}
			.close-tab {
				padding-left: 10px;
			}
		}
	}
}
</style>
