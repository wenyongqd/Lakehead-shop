import $C from './config.js'

export default {
	common: {
		method:'GET',
		header:{
			// "content-type":"application/json",
			"content-type":"application/x-www-form-urlencoded"
		},
		data:{},
		timeout: 10000,
		dataType:"json"
	},
	request(options = {}) {
		options.url = $C.webUrl + options.url
		options.method = options.method || this.common.method
		options.header = options.header || this.common.header
		return uni.request(options)
	},
	
	get (url, data = {}, options={}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	
	post (url, data = {}, options={}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	
	put (url, data = {}, options={}) {
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	
	del (url, data = {}, options={}) {
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	
	
}