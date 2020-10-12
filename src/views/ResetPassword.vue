<template>
	<div class="reset">
		<form @submit.prevent="resetPassword" class="reset__form" >
			<h2>Reset Password</h2>
			<reg-input class="email" v-model="password" :label="'New Password'" />
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
			confirm_password: ''
		}
	},
	components: {
		RegInput
	},
	methods: {
		resetPassword() {
			if (this.password === this.confirm_password) {
				axios.post('/reset', {
					password: this.password,
					token: this.$route.params.token
				}).then(res => {
					if (res.status === 200) {
						setTimeout(() => {
							this.$router.push('/')
						}, 5000)
					}
					console.log(res)
				}).catch(e => console.log(e))
			} else {
				console.log('Passwords does not match!')
			}
		}
	}
}
</script>