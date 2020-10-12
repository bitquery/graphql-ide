import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.credentials = 'include'

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

export const getQuery = url => axios.get(`/getquery/${url}`)