<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<style lang="scss">
#app {
	font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	background-color: #16162c;
	height: 100%;
	p, a {
		padding: 10px 0;
		color: #d7d7d7;
	}
	h2 {
		font-size: 35px;
		padding: 30px 0 30px 0;
		color: #d7d7d7;

	}
	h1 {
		font-size: 28px;
		color: #d7d7d7;
	}
	overflow: hidden;
}
.topBar {
	background-color: #1f2e4d !important;
}
.flex{
	display: flex;
	&-row{
		flex-direction: row;
	}
	&-col {
		flex-direction: column;
	}
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
