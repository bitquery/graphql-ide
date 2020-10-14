<template>
	<div @click="executeQuery" class="main">
		<modal-window :showModal="showModal" @hide="showModal = false">
			<div slot="body" class="modal modal__save">
				<reg-input v-model="query_name" :label="'Enter query name (required)'" />
				<reg-input v-model="query_description" :label="'Enter description'" />
				<button class="button button__save" @click="saveQuery(params.value())">Save</button>
				<button class="button button__save" @click="saveQuery(params.withUrl())">Save & Link</button>
				<p v-if="link">Your link <a :href="`http://localhost:8080/query/${link}`">{{`http://localhost:8080/query/${link}`}}</a></p>
			</div>
		</modal-window>
		<modal-window :showModal="showRegister" @hide="showRegister = false">
			<div slot="body" class="modal modal__signup">
				<reg-input v-model="email" :label="'Username (email)'" />
				<reg-input v-model="password" :label="'Password'" />
				<button class="button button__signup" @click="login">Login</button>
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
						<span class="tab__close" @click.stop="removeTab(index)" />
					</li>
					<li @click="addNewTab" class="tabs__add" ><span class="tab__add" /></li>
				</ul>
			</div>
			<div v-if="user" class="profile flex">
				<img @click="toggleProfileMenu" src="../assets/images/user.svg" alt="Profile" >
				<p class="profile__email">{{this.user.email}}</p>
				<div :class="['profile__controls', 'flex', 'flex-col', {'active': show_profile_menu}]" >
					<button class="button button__save" @click="showModal = true" >Save query</button>
					<button @click="$router.push('/reset')" class="button button__reset">Change password</button>
					<button class="button button__logout" @click="logout" >Logout</button>
				</div>
			</div>
			<button v-else class="button button__signin" @click="showRegister = true" >Login</button>
			<div class="endpoint_url">
				<reg-input v-model="endpoint_url" />
			</div>
		</div>
		<graphiql 
			v-for="(tab ) in tabs" :key="tab"
			:class="['giql__wrapper', {'giql__wrapper_active': currentTab === tab} ]"
			:fetcher="fetcher" 
			:query="query || undefined"
			:editorTheme="'dracula'"
		/>
	</div>
</template>

<script>
import graphiql from 'graphiql'
import RegInput from '../components/RegInput'
import { login, logout, getUser, getQuery } from '../api/api'
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
			endpoint_url: 'https://graphql.bitquery.io',
			show_profile_menu: false,
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
			tabs: ['1']
		}
	},
	async mounted() {
		this.getUser()
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
	computed: {
		params() {
			let params = {
				account_id: this.user.id,
				query: this.currentQuery,
				arguments: 'arguments',
				name: this.query_name || null,
				description: this.query_description || null
			}
			return {
				value: () => params,
				withUrl: () => {
					params.url = this.link = generateLink()
					return params
				}
			}
		}
	},
	methods: {
		async fetcher(graphQLParams) {
			if (this.queryButton && this.user) {
				this.saveQuery(this.params.value())
			}
			const data = await fetch(
				this.endpoint_url,
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
		async getUser() {
			try {
				const { data } = await getUser()
				this.user = data.user[0]
			} catch (e) { console.log(e.response.data) } 
		},
		async login() {
			try {
				const { data } = await login(this.email, this.password)
				this.$toast(data)
				this.getUser()
				this.showRegister = false 
			} catch (e) { this.$toast(e.response.data[2].message) }
		},
		async logout() {
			await logout().catch(e => console.log(e))
			this.user = null
			this.show_profile_menu = false
		},
		async saveQuery(params) {
			try {
				if (!this.queryButton) {
					this.tabs[this.tabs.indexOf(this.currentTab)] = this.query_name
					this.currentTab = this.query_name
				}
				const { data } = await axios.post('/addquery', { params })
				this.$toast(data)
			} catch (e) { console.log(e) }
			
		},
		executeQuery(event) {
			this.queryButton = ( event.target.classList.value === 'execute-button' )
				? true : false
		},
		switchTab(tab) {
			this.queryButton = false
			this.currentTab = tab
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
		toggleProfileMenu() {
			if (this.user) {
				this.show_profile_menu = !this.show_profile_menu
			}
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
.CodeMirror{
	&-cursor {
		border-color: #d7d7d7 !important;
	}
	&-line {
		text-align: left;
	}
}
.giql__wrapper {
	min-height: 100%;
	display: none;
	caret-color: #d7d7d7;
	&_active {
		display: block;
	}
	.topBar {
		height: 54px !important;
		background: #353848 !important;
		color: #d7d7d7;
		border-bottom: none !important;
	}
	.secondary-editor-title {
		background: #353848 !important;
		border: none !important;
	}
	.resultWrap {
		border-color: #353848 !important;
	}
}
.tabs {
	flex: 1 1 auto;
	&__add {
		padding: 20px 10px 0;
	}
	.tab {
		&__close{
			background: url('../assets/images/letter-x.svg') center no-repeat ;
			margin-left: 15px;
			padding-left: 12px;
			opacity: 0%;
		}
		&__add {
			background: url('../assets/images/plus.svg') center no-repeat ;
			padding: 7px;
			opacity: 50%;
		}
	}
	ul {
		display: flex;
		list-style: none;
		margin-bottom: 0;
		li:not(.tabs__add) {
			padding: 20px 10px 20px 20px;
		}
		li {
			display: block;
			cursor: pointer;
			margin: 0 7px;
			color: #c2c2c2;
			background-color: #282a36;
			&:hover, &.active {
				background-color:#353848;
				.tab {
					&__close {
						opacity: 50%;
					}
				}
			}
			&.active {
				color: #fff;
				// padding-right: 10px;
			}
			.close-tab {
				padding-left: 10px;
			}
			
		}
	}
}
.controlpanel {
	align-items: center;
	position: relative;
	.endpoint_url {
		position: absolute;
		top: 42px;
		left: 460px;
		input {
			text-align: left;
			width: 200%;
			border: none;
			color: #d7d7d7;
		}
	}
}
.profile{
	align-items: center;
	flex-direction: row-reverse;
	justify-content: flex-end;
	position: relative;
	margin: 0 5px 0 0;
	&__controls {
		background-color: #16162c;
		padding: 10px;
		z-index: 3;
		position: absolute;
		display: none;
		top: 50px;
		&.active {
			display: block;
		}
	}
	img {
		padding: 0 10px;
		cursor: pointer;
	}
}
.button {
	cursor: pointer;
	width: 150px;
	border: 1px solid #c27a7a38;
	background-color:#353848;
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
