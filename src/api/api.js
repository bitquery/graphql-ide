import axios from 'axios'
/* import { observable } from 'mobx'
import { UserStore } from '../store/queriesStore'
const { user } = observable(UserStore) */
axios.defaults.withCredentials = true
axios.defaults.credentials = 'include'
// axios.defaults.headers.common['X-API-KEY'] = user?.key

export const signUp = (email, password) => 
	axios.post('/api/signup', {
		email,
		password
	})

export const login = (email, password) => 
	axios.post('/api/login', {
		email,
		password
	})

export const logout = () => axios.get('/api/logout')

export const getUser = () => axios.get('/api/user')

export const regenerateKey = key => axios.post('/api/regenerate', {key})

export const getQuery = url => axios.get(`/api/getquery/${url}`)

export const deleteQuery = id => axios.post('/api/deletequery', 
	{ id }  
)
