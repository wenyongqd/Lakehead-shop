<script>
	import {
		mapMutations
	} from 'vuex';
	
	export default {
		methods: {
			...mapMutations(['login']) // 将 `this.login()` 映射为 `this.$store.commit('login')`
		},
		onLaunch: function() {
			let userInfo = uni.getStorageSync('userInfo') || '';
			uni.setStorageSync("appid", "wx598b8cffcc9b943c")
			uni.setStorageSync("secret", "d44679dc8263c8525e13c5846f3d1b43")
			uni.setStorageSync("jwt", "")
			uni.setStorageSync("hasLogin", false)
			uni.setStorageSync("userInfo", {})
			if(userInfo.id){
				//更新登陆状态
				uni.getStorage({
					key: "userInfo",
					success: (res) => {
						this.login(res.data);
					}
				});
			}
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
	
    @import './common/iconfont.css';
	
	@import './common/animate.css';
	
	@import './common/common.css';
	/* 自定义样式库 */
	@import "./common/free.css";
</style>
