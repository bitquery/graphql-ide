import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.credentials = 'include'

export const signUp = (email, password, accountName, companyName, captcha) => 
	axios.post('/api/signup', {
		email,
		password,
		accountName,
		companyName,
		captcha
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
export const getCheckoutCode = source => axios.get('/api/js', {
	params: { source: `../../${source}` }
})
