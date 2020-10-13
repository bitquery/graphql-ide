<template>
	<div @click="executeQuery" class="main">
		<modal-window :showModal="showModal" @hide="showModal = false">
			<div slot="body" class="modal modal__save">
				<reg-input v-model="query_name" :label="'Enter query name (required)'" />
				<reg-input v-model="query_description" :label="'Enter description'" />
				<button class="button button__save" @click="saveWithParams">Save</button>
				<button class="button button__save" @click="shareQuery">Save & Link</button>
				<p v-if="link">Your link <a :href="`http://localhost:8080/query/${link}`">{{`http://localhost:8080/query/${link}`}}</a></p>
			</div>
		</modal-window>
		<modal-window :showModal="showRegister" @hide="showRegister = false">
			<div slot="body" class="modal modal__signup">
				<reg-input v-model="email" :label="'Username (email)'" />
				<reg-input v-model="password" :label="'Password'" />
				<button class="button button__signup" @click="login">SignIn</button>
				<a href="javascript:void(0)" @click="$router.push('/forgot')">Forgot password?</a>
				<a href="javascript:void(0)" @click="$router.push('/register')">Do not have account?</a>
			</div>
		</modal-window>
		<div class="controlpanel flex">
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
			<div v-if="user" class="profile flex">
				<img @click="$router.push('/profile')" src="../assets/images/user.svg" alt="Profile">
				<p>{{this.user.email}}</p>
			</div>
			<div class="controls">
				<button v-if="user" class="button button__save" @click="showModal = true">Save Query</button>
				<button v-if="user" class="button button__logout" @click="logout">Logout</button>
				<button v-else class="button button__signin" @click="showRegister = true" >Sign In</button>
			</div>
		</div>
		<graphiql 
			v-for="(tab ) in tabs" :key="tab"
			:class="['giql__wrapper', {'giql__wrapper_active': currentTab === tab} ]"
			:fetcher="fetcher" 
			:query="query || undefined"
			:onEditQuery="onEditQuery"
		/>
	</div>
</template>

<script>
import graphiql from 'graphiql'
import RegInput from '../components/RegInput'
import { signUp, login, logout, getUser, getQuery } from '../api/api'
import ModalWindow from '../components/ModalWindow'
import axios from 'axios'
import { generateLink } from '../utils/common'
export default {
	name: 'Main',
	components: {
		graphiql,
		ModalWindow,
		RegInput
	},
	data() {
		return {
			user: null,
			showRegister: false,
			email: '',
			password: '',
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
				arguments: 'arguments',
				success_count: 1,
				error_count: 0,
				created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
			}
		}
	},
	async mounted() {
		getUser().then(res => {
			console.log(res)
			this.user = res.data.user[0]
		}).catch(e => console.log(e.response.data))
		this.currentQuery = localStorage.getItem('graphiql:query')
		if (this.$route.params.url) {
			try {
				let { data } = await getQuery(this.$route.params.url)
				if (data) {
					this.tabs.push(data.name)
					this.currentTab = data.name
					this.query = this.currentQuery = data.query
				}
			} catch (e) {
				this.$toast(e.response.data)
			}
		}
	},
	methods: {
		login() {
			login(this.email, this.password).then((response) => {
				this.$toast(response.data)
				getUser().then(res => {
					console.log(res)
					this.user = res.data.user[0]
				})
				this.showRegister = false
			})
			.catch((e) => {
				this.$toast(e.response.data[2].message)
			})
		},
		logout() {
			logout().then(res => {console.log(res.data); this.user = null;}).catch(err => console.log(err))
		},
		executeQuery(event) {
			if (event.target.classList.value === 'execute-button' ) {
				this.queryButton = true
			} else {
				this.queryButton = false
			}
		},
		switchTab(tab) {
			this.queryButton = false
			this.currentTab = tab
		},
		async fetcher(graphQLParams) {
			if (this.queryButton && this.user) {
				let params = this.params
				params.description = 'request'
				params.account_id = this.user.id
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
			this.queryButton = false
			return data.json().catch(() => data.text())
			
		},
		saveWithParams() {
			let params = this.params
			params.query = this.currentQuery
			params.name = this.query_name
			params.account_id = this.user.id
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
			axios.post('/addquery', {
				params: params || this.params
			})
			.then(res => console.log('saved', res))
			.catch(error => console.log(error))
		},
		onEditQuery(query) {
			if (this.user) {
				this.currentQuery = query
				axios.post('/updatequery', {
					params: {
						account_id: this.user.id,
						query: this.currentQuery,
						arguments: 'arguments',
						success_count: 1,
						error_count: 0,
						created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
					}
				})
				.then(res => console.log('updated', res))
				.catch(error => console.log(error))
			}
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
	padding-top: 20px;
}
#graphiql {
	min-height: 100%;
}
.CodeMirror{
 	&-line {
		text-align: left;
		margin-left: 5px !important;
	}
	&-lines {
		font-size: 20px;
	}
	&-foldgutter{
		width: 1em !important;
	}
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
	flex: 1 1 auto;
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
			-webkit-box-shadow: 10px 10px 10px 0px rgba(176,176,176,0.78);
			-moz-box-shadow: 10px 10px 10px 0px rgba(176,176,176,0.78);
			box-shadow: 10px 10px 10px 0px rgba(176,176,176,0.78);
		}
	}
}
.controlpanel {
	align-items: center;
}
.profile{
	align-items: center;
	margin: 0 5px 0 0;
	img {
		cursor: pointer;
	}
}
.button {
	cursor: pointer;
	width: 150px;
	border: 1px solid #c27a7a38;
	background-color: #bb7a7a;
	color: #d7d7d7;
	padding: 10px;
	margin: 0 5px 0 0;
	border-radius: 10px;
	outline: none;
	&:hover {
		background-color: #ae9669;
	}
}
.modal {
	display: flex;
	flex-direction: column;
	.button {
		margin: 35px auto 0;
	}
}
</style>
