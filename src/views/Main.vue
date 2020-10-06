<template>
	<div class="main">
		<button class="button button__save" @click="saveQuery">Save Query</button>
		<button class="button button__copyLink">Copy Link</button>
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
			:query="query || undefined"
			@onEditQuery="onEditQuery"
		/>
	</div>
</template>

<script>
import graphiql from 'graphiql'
import axios from 'axios'
// import { generateLink } from '../utils/common'
export default {
	name: 'Main',
	components: {
		graphiql,
	},
	data() {
		return {
			query: '',
			currentQuery: '',
			currentTab: '1',
			tabs: ['1'],
			params: {
				account_id: 2,
				query: this.currentQuery,
				arguments: 'arguments',
				success_count: 1,
				error_count: 0,
				created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
			}
		}
	},
	methods: {
		async fetcher(graphQLParams) {
			let params = this.params
			params.description = 'request'
			this.saveQuery()
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
		},
		saveQuery() {
			axios.post('http://localhost:3000/addquery', {
				params: {
					account_id: 2,
					query: this.currentQuery,
					arguments: 'arguments',
					success_count: 1,
					error_count: 0,
					created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
				}
			})
			.then(res => console.log('saved', res))
			.catch(error => console.log(error))
		},
		onEditQuery(query) {
			this.currentQuery = query
			axios.post('http://localhost:3000/updatequery', {
				params: {
					account_id: 2,
					query: this.currentQuery,
					arguments: 'arguments',
					success_count: 1,
					error_count: 0,
					created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
				}
			})
			.then(res => console.log('updated', res))
			.catch(error => console.log(error))
		},
		getQueryLink() {

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
.button {
	&__copyLink, &__save {
		width: 100px;
	}
}
</style>
