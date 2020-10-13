<template>
	<div class="reset">
		<form @submit.prevent="signUp" class="reset__form" >
			<h2>Register account</h2>
			<reg-input class="email" v-model="email" :label="'Email'" />
			<reg-input class="confirm_password" v-model="password" :label="'Password'" />
			<button class="button button__submit" type="submit">Sign Up</button>
		</form>
	</div>
</template>

<script>
import RegInput from '../components/RegInput'
import { signUp } from '../api/api'
export default {
	name: 'Register',
	data() {
		return {
			email: '',
			password: ''
		}
	},
	components: {
		RegInput
	},
	methods: {
		signUp() {
			signUp(this.email, this.password)
			.then((response) => {
				console.log("Signed up", response)
				this.$router.push('/')
			})
			.catch((errors) => {
				console.log("signup error", errors)
			})
		}
	}
}
</script>