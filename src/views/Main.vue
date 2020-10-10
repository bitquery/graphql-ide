<template>
	<div @click="executeQuery" class="main">
		<modal-window :showModal="showModal" @hide="showModal = false">
			<div slot="body" class="modal modal__save">
				<p>Enter query name (required)</p>			
				<input class="query__save" type="text" v-model="query_name">
				<p>Enter description</p>			
				<input class="query__save" type="text" v-model="query_description">
				<button class="button button__save" @click="saveWithParams">Save</button>
				<button class="button button__save" @click="shareQuery">Save & Link</button>
				<p v-if="link">Your link <a :href="`http://localhost:8080/${link}`">{{`http://localhost:8080/${link}`}}</a></p>
			</div>
		</modal-window>
		<modal-window :showModal="showRegister" @hide="showRegister = false">
			<div slot="body" class="modal modal__signup">
				<p>Username (Email)</p>			
				<input class="query__save" type="text" v-model="email">
				<p>Password</p>			
				<input class="query__save" type="password" v-model="password">
				<button class="button button__signup" @click="signUp">SignUp</button>
				
			</div>
		</modal-window>
		<form v-if="!user" v-on:submit="login">
			<p>user@email.com</p>
			<input type="text" name="email"/><br>
			<p>password</p>
			<input type="password" name="password"/><br>
			<input type="submit" value="Login"/>
		</form>
		<p v-else> Hello, {{this.user.email}} </p>
		<div class="control">
			<button class="button button__save" @click="showModal = true">Save Query</button>
			<button class="button button__signin" @click="showRegister = true" >Sign In</button>
			<button class="button button__signup" @click="showRegister = true">Sign Up</button>
			<button v-if="user" class="button button__logout" @click="logout">Logout</button>
		</div>
		
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
			let { data } = await axios.get(`/getquery/${this.$route.params.url}`)
			if (data) {
				this.tabs.push(data.name)
				this.currentTab = data.name
				this.query = this.currentQuery = data.query
			}
		}
	},
	methods: {
		getUser() {
			return axios.get('/api/user')
		},
		login(e) {
			e.preventDefault()
			let email = e.target.elements.email.value
			let password = e.target.elements.password.value
			let data = {
				email: email,
				password: password
			}

			axios.post("/api/login", data, {
				withCredentials: true,
				credentials: 'include',
			})
			.then((response) => {
				console.log("Logged in", response)
				this.getUser().then(res => {
					console.log(res)
					this.user = res.data.user[0]
				}).catch(e => console.log(e))
			})
			.catch((errors) => {
				console.log("Cannot log in", errors)
			})
		},
		
		logout() {
			axios.get('/api/logout').then(res => {console.log(res); this.user = null;}).catch(err => console.log(err))
		},
		signUp() {
			axios.post("/api/signup", {
					email: this.email,
					password: this.password,
			}, {
				withCredentials: true,
				credentials: 'include',
			})
			.then((response) => {
				console.log("Signed up", response)
				//router.push("/dashboard")
			})
			.catch((errors) => {
				console.log("signup error", errors)
			})
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
		showTarget(e) {
			console.log(e.target)
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
			this.queryButton = false
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
			axios.post('/addquery', {
				params: params || this.params
			})
			.then(res => console.log('saved', res))
			.catch(error => console.log(error))
		},
		onEditQuery(query) {
			this.currentQuery = query
			axios.post('/updatequery', {
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
			-webkit-box-shadow: 10px 10px 10px 0px rgba(176,176,176,0.78);
			-moz-box-shadow: 10px 10px 10px 0px rgba(176,176,176,0.78);
			box-shadow: 10px 10px 10px 0px rgba(176,176,176,0.78);
		}
	}
}
.button {
	cursor: pointer;
	width: 150px;
	border: 1px solid #c27a7a38;
	background-color: #bb7a7a;
	color: #d7d7d7;
	padding: 20px;
	border-radius: 10px;
	outline: none;
	&:not(:last-child) {
		margin: 10px 10px 0 0;
	}
	&:hover {
		background-color: #ae9669;
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
.modal {
	display: flex;
	flex-direction: column;
	.button {
		margin: 35px auto 0;
	}
}
</style>
