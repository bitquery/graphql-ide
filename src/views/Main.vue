<template>
	<div @click="executeQuery" class="main">
		<modal-window :showModal="showModal" @hide="closeModal">
			<div slot="body" class="modal__save">
				<p>Enter query name (required)</p>			
				<input class="query__save" type="text" v-model="query_name">
				<p>Enter description</p>			
				<input class="query__save" type="text" v-model="query_description">
				<button class="button button__save" @click="shareQuery">Save</button>
				<p v-if="link">Your link {{link}}</p>
			</div>
		</modal-window>
		<button class="button button__save" @click="openModal">Save Query</button>
		<button class="button button__copyLink" @click="openModal">Copy Link</button>
		<div class="tabs">
			<ul>
				<li
					v-for="(tab, index) in tabs" :key="tab"
					:class="{'active': currentTab === tab}"
					@click="switchTab(tab)"
				>
					{{tab}}
					<span class="tab__close" @click.stop="removeTab(index)">❌</span>
				</li>
				<li @click="addNewTab" >+</li>
			</ul>
		</div>
		<graphiql 
			
			v-for="(tab ) in tabs" :key="tab"
			:class="['giql__wrapper', {'giql__wrapper_active': currentTab === tab} ]"
			:fetcher="fetcher" 
			:query="query || undefined"
			@onEditQuery="onEditQuery"
		/>
	</div>
</template>

<script>
import graphiql from 'graphiql'
import ModalWindow from '../components/ModalWindow'
import axios from 'axios'
import { generateLink } from '../utils/common'
export default {
	name: 'Main',
	components: {
		graphiql,
		ModalWindow
	},
	data() {
		return {
			link: '',
			queryButton: false,
			query_name: '',
			query_description: '',
			showModal: false,
			query: '',
			currentQuery: '',
			currentTab: '1',
			tabs: ['1'],
			params: {
				account_id: 2,
				arguments: 'arguments',
				success_count: 1,
				error_count: 0,
				created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
			}
		}
	},
	async mounted() {
		this.currentQuery = localStorage.getItem('graphiql:query')
		if (this.$route.params.url) {
			let { data } = await axios.get(`http://localhost:3000/getquery/${this.$route.params.url}`)
			if (data) {
				this.tabs.push(data.name)
				this.currentTab = data.name
				this.query = this.currentQuery = data.query
			}
		}
	},
	methods: {
		executeQuery(event) {
			if (event.target.classList.value === 'execute-button' ) {
				this.queryButton = true
			} else {
				this.queryButton = false
			}
		},
		switchTab(tab) {
			this.currentTab = tab
		},
		showTarget(e) {
			console.log(e.target)
		},
		openModal() {
			this.showModal = true
		},
		closeModal() {
			this.showModal = false
			setTimeout(() => {this.bulk++}, 0)
		},
		async fetcher(graphQLParams) {
			if (this.queryButton) {
				let params = this.params
				params.description = 'request'
				this.saveQuery(params)
			}
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
		saveWithParams() {
			let params = this.params
			params.name = this.query_name
			params.query = this.currentQuery
			if (this.query_description) params.description = this.query_description
			this.saveQuery(params)
			this.tabs[this.tabs.indexOf(this.currentTab)] = this.query_name
			this.showModal = false
			this.currentTab = this.query_name
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
		saveQuery(params) {
			axios.post('http://localhost:3000/addquery', {
				params: params || this.params
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
		shareQuery() {
			let params = this.params
			params.query = this.currentQuery
			params.name = this.query_name
			if (this.query_description) params.description = this.query_description
			params.url = generateLink()
			this.saveQuery(params)
			this.tabs[this.tabs.indexOf(this.currentTab)] = this.query_name
			this.link = params.url
			this.currentTab = this.query_name
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
.query {
	&__save {
		padding: 10px;
		border-radius: 5px;
		border: none;
		border-bottom: 1px solid #aaa;
		outline: none;
		text-align: center;
	}
}
.modal__save {
	display: flex;
	flex-direction: column;
	.button {
		margin: 35px auto 0;
	}
}
</style>
