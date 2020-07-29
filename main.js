import Vue from 'vue'
import App from './App'
import store from './store/index.js';
import qs from 'qs'
Vue.prototype.$qs = qs;
import Json from './Json' //测试用数据
// import jweixin from 'components/jweixin-module/index.js'
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
//微信JS-SDK
// var jweixin = require('jweixin-module')
// jweixin.ready(function(){
//     // TODO
// });


const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
Vue.prototype.qs = qs;
//指定格式


Vue.prototype.$store = store

//引入请求库
import $H from 'common/request.js'
Vue.prototype.$H = $H

Vue.prototype.checkAuth = (callback)=>{
	// 权限验证
	if (!store.state.loginStatus) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		});
		return uni.navigateTo({
			url: '/pages/login/login'
		});
	}

	callback()
}

Vue.prototype.$api = {msg, json, prePage};
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
