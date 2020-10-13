<template>
	<div class="reset">
		<form @submit.prevent="sendPasswrodResetLink" class="reset__form" >
			<h2>Forgot Password</h2>
			<reg-input class="email" v-model="email" :label="'Email'" />
			<button class="button button__submit" type="submit">Send</button>
		</form>
	</div>
</template>

<script>
import RegInput from '../components/RegInput'
import axios from 'axios'
export default {
	name: 'ForgotPassword',
	data() {
		return {
			email: ''
		}
	},
	components: {
		RegInput
	},
	methods: {
		sendPasswrodResetLink() {
			axios.post('/forgot', {
				email: this.email
			})
				.then(res => this.$toast(res.data))
				.catch(e => this.$toast(e.response.data))
		}
	}
}
</script>

<style lang="scss">
.reset{
	display: flex;
	flex-direction: column;
	align-items: center;
	&__form {
		display: flex;
		flex-direction: column;
		align-items: center;
		.query__save {
			width: 600px;
		}
	}
	.button {
		&__submit {
			margin-top: 10px;
		}
	}
}
</style>
