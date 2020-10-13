<template>
	<div v-if="user" class="flex flex-col profile">
		<h2>Profile</h2>
		<div class="profile__info">
			<h1>Email</h1>
			<p> {{user.email}} </p>
		</div>
		<div class="profile__info">
			<h1>ID</h1>
			<p> {{user.id}} </p>
		</div>
		<div class="profile__info">
			<h1>Created at</h1>
			<p> {{user.created_at.substring(0, 10)}} </p>
		</div>
		<div class="profile__info">
			<h1>Updated at</h1>
			<p> {{user.updated_at.substring(0, 10)}} </p>
		</div>
		<button @click="$router.push('/reset')" class="button">Change password</button>
	</div>
</template>

<script>
import { getUser } from '../api/api'

export default {
	name: 'Profile',
	data() {
		return {
			user: null
		}
	},
	async created() {
		getUser().then(res => {
			console.log(res)
			this.user = res.data.user[0]
		}).catch(e => console.log(e))
		
	}
}
</script>

<style lang="scss" scoped>
.profile__info {
	margin-bottom: 20px;
	/* .email {
		position: relative;
		&::after {
			cursor: pointer;
			position: absolute;
			right: -30px;
			top: 8px;
			display: block;
			width: 20px;
			height: 20px;
			background: url('../assets/images/edit.svg') no-repeat;
			content: "";
		}
	} */
}
</style>