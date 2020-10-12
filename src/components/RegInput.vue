<template>
	<fragment>
		<p>{{label}}</p>			
		<input ref="reginput" class="query__save" type="text" @input="handleInput">
	</fragment>
</template>

<script>
export default {
	name: 'RegInput',
	props: {
		label: {
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
	}
}
</style>