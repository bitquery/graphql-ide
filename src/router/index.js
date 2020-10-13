import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import ForgotPassword from '../views/ForgotPassword'
import ResetPassword from '../views/ResetPassword'
import Register from '../views/Register'
import Profile from '../views/Profile'

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
		path: '/reset',
		name: 'ResetPassword',
		component: ResetPassword,
		children: [
			{
				path: ':token',
				name: 'ResetPassword',
				component: ResetPassword
			}
		]
	},
	{
		path: '/register',
		name: 'Register',
		component: Register
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile
	}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
