import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.credentials = 'include'
axios.defaults.baseURL = window.location.origin

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

export const getUser = () => axios.get('/api/user')

export const regenerateKey = key => axios.post('/api/regenerate', {key})

export const getQuery = url => axios.get(`/api/getquery/${url}`)

export const getAllQueries = () => axios.get('/api/getqueries')

export const getMyQueries = () => axios.get('/api/getmyqueries')

export const deleteQuery = (id, layout) => axios.post('/api/deletequery', 
	{ id, layout }  
)
export const getCheckoutCode = source => axios.get('/api/js', {
	params: { source: `../../${source}` }
})

export const getDashboardQueries = url => axios.get(`/api/dashboardsquery/${url}`)

export const setDashboard = data => axios.post('/api/savedashboard', data)

export const getWidget = url => axios.get(`/api/getw/${url}`)

// export const getQueryForDashboard = ids => axios.get(`/api/getwidget/${ids}`)
export const getQueryForDashboard = (ids, dbid) => axios.post(`/api/getwidget`, {ids, dbid})

export const getTagsList = queryListType => axios.post('/api/tags', {queryListType})

//queryListType = 'explore' || 'myqueries' || 'team'
export const getTaggedQueriesList = (tag, page, queryListType) => axios.post(`/api/taggedqueries/${tag}/${page||0}`, {queryListType})

export const checkUrl = url => axios.post('/api/checkurl', { url })

export const getTransferedQuery = query => axios.get(`/api/transferedquery/${query}`)

export const getSearchResults = search => axios.post('/api/search', {search})

export const getCodeSnippet = body => axios.post('/api/codesnippet', body)

export const copyQuery = body => axios.post('/api/copyquery', body)

export const getQueryByID = queryID => axios.get(`/api/bygraphqlqueryid/${queryID}`)

export const getWidgetConfig = id =>  axios.get(`/api/getwidgetconfig/${id}`)

export const getQueryTemplates = (address, symbol) => axios.get(`/api/querytss/${address}/${symbol}`)

export const getGenerateQueryImage = queryID => axios.get(`api/generateimage/${queryID}`)

export const getGPTResponse = (messages) => axios.post('/api/getgptresponse', { messages })