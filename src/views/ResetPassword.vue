<template>
	<div class="reset">
		<form @submit.prevent="resetPassword" class="reset__form" >
			<h2>Reset Password</h2>
			<reg-input v-if="change" class="password" v-model="old_password" :label="'Old password'" />
			<reg-input class="password" v-model="password" :label="'New Password'" />
			<reg-input class="confirm_password" v-model="confirm_password" :label="'Confirm Password'" />
			<button class="button button__submit" type="submit">Apply</button>
		</form>
	</div>
</template>

<script>
import RegInput from '../components/RegInput'
import axios from 'axios'
export default {
	name: 'ResetPassword',
	data() {
		return {
			password: '',
			old_password: '',
			confirm_password: '',
			change: false,
		}
	},
	components: {
		RegInput
	},
	beforeRouteEnter: (to, from, next) => {
		if (from.name === 'Profile') {
			next(vm => {
				vm.change = true
			})
		}
		next()
	},
	methods: {
		redirectToMain(res) {
			if (res.status === 200) {
				setTimeout(() => {
					this.$router.push('/')
				}, 5000)
			}
		},
		resetPassword() {
			if (this.password === this.confirm_password && !this.old_password && this.password) {
				axios.post('/reset', {
					password: this.password,
					token: this.$route.params.token
				}).then(res => {
					this.redirectToMain(res)
					this.$toast(res.data)
					this.$toast('Will be redirect in 5 sec')
				}).catch(e => this.$toast(e.response.data))
			} else if (this.password === this.confirm_password && this.old_password && this.password) {
				axios.post('/changepassword', {
					old_password: this.old_password,
					password: this.password
				}).then(res => {
					this.redirectToMain(res)
					this.$toast(res.data)
					this.$toast('Will be redirect in 5 sec')
				}).catch(e => this.$toast(e.response.data))
			} else {
				this.$toast('Fill in all the fields!')
			}
		}
	}
}
</script>