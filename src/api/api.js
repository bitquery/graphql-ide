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

export const regenerateKey = key => axios.post('/api/regenerate', {key})

export const getQuery = url => axios.get(`/api/getquery/${url}`)

export const deleteQuery = id => axios.post('/api/deletequery', 
	{ id }  
)
export const getCheckoutCode = source => axios.get('/api/js', {
	params: { source: `../../${source}` }
})

export const getDashboardQueries = url => axios.get(`/api/dashboardsquery/${url}`)

export const setDashboard = data => axios.post('/api/savedashboard', data)

export const getWidget = url => axios.get(`/api/getw/${url}`)

export const getQueryForDashboard = ids => axios.get(`/api/getwidget/${ids}`)
