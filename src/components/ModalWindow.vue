<template>
	<div>
		<transition name="modal">
			<div class="modal-mask" v-if="lol" @mousedown.self="onCloseOnClickMask">
				<div class="modal-wrapper" @mousedown.self="onCloseOnClickMask">
					<div class="modal-container" v-if="lol">
						<div class="modal-header">
							<slot name="header"></slot>
						</div>
						<div class="modal-body text-xs-center">
							<slot name="body">default body</slot>
						</div>
						<div class="modal-footer">
							<slot name="footer"></slot>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: "ModalWindow",
	props: ["showModal"],
	methods: {
		onCloseOnClickMask() {
			this.$emit("hide");
		}
	},
	computed: {
		lol() {
			return this.showModal ? true : false;
		}
	}
};
</script>

<style lang="scss" scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}

.modal-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 30px auto;
}

.modal-container {
	overflow: auto;
	display: flex;
	flex-direction: column;
	position: relative;
	//max-height: 80vh;
	min-width: 450px;
	width: 40%;
	top: 0;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 0.3rem;
	outline: 0;
	transition: all 0.3s;
}

.modal-header {
	h3 {
		margin-top: 0;
		color: #42b983;
	}
}

.modal-body {
	padding: 20px;
	margin: 20px 0;
	overflow-y: auto;
}
.modal-footer {
}

.modal-default-button {
	margin: 0 10px;
}

.modal-enter {
	opacity: 0;
}

.modal-leave-active {
	opacity: 0;
}
.modal_body-enter {
	top: -25%;
}

.modal_body-leave-active {
	top: -25%;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: translateY(-25%);
	transform: translateY(-25%);
}
</style>