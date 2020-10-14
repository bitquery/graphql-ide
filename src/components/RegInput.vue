<template>
	<fragment>
		<p>{{label}}</p>			
		<input ref="reginput" :value="value" class="query__save" type="text" @input="handleInput">
	</fragment>
</template>

<script>
export default {
	name: 'RegInput',
	props: {
		label: {
			type: String,
			default: ''
		},
		value: {
			type: String,
			default: ''
		}
	},
	methods: {
		handleInput() {
			this.$emit('input', this.$refs.reginput.value)
		}
	}
}
</script>

<style lang="scss">
.query {
	&__save {
		font-size: 20px;
		padding: 10px;
		border-radius: 5px;
		border: none;
		border-bottom: 1px solid #aaa;
		outline: none;
		text-align: center;
		background: #414457;
		color: #d7d7d7;
	}
}
</style>