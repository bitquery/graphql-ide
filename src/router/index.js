import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import ForgotPassword from '../views/ForgotPassword'
import ResetPassword from '../views/ResetPassword'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Main',
		component: Main,
		children: [
			{
				path: '/query/:url',
				component: Main
			}
		]
	},
	{
		path: '/forgot',
		name: 'Forgot Password',
		component: ForgotPassword
	},
	{
		path: '/reset/:token',
		name: 'ResetPassword',
		component: ResetPassword
	}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
