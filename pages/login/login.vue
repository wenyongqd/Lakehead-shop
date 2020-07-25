<template>
	<view>
		<!-- #ifndef MP -->
		<uni-status-bar></uni-status-bar>
		<view>
			<view class="iconfont icon-guanbi flex align-center justify-center font-lg" style="width: 100rpx;height: 100rpx;"
			 hover-class="bg-light" @click="back"></view>
		</view>
		<!-- #endif -->

		<view class="text-center" style="padding-top: 30rpx;padding-bottom: 70rpx;font-size: 55rpx;">{{status ? '手机验证码登录':'Login'}}</view>

		<view class="px-2">
			<template v-if="!status">
				<view class="mb-2">
					<input type="text" v-model="username" placeholder="Id/Phone number/Email" class="border-bottom p-2" @input="inputChange" />
				</view>
				<view class="mb-2 flex align-stretch">
					<input type="text" v-model="password" placeholder="Please inout password" class="border-bottom p-2 flex-1" @input="inputChange"
					 @confirm="toLogin" />
					<view class="border-bottom flex align-center justify-center font text-muted" style="width: 250rpx;">Forget
						password?</view>
				</view>
			</template>

			<template v-else>
				<view class="mb-2 flex align-stretch">
					<view class="border-bottom flex align-center justify-center font px-2">+86</view>
					<input type="text" v-model="phone" placeholder="手机号" class="border-bottom p-2 flex-1" />
				</view>
				<view class="mb-2 flex align-stretch">
					<input type="text" v-model="code" placeholder="请输入验证码" class="border-bottom p-2 flex-1" />
					<view class="border-bottom flex align-center justify-center font-sm text-white" :class="codeTime > 0 ? 'bg-main-disabled' : 'bg-main'"
					 style="width: 180rpx;" @click="getCode">{{codeTime > 0 ? codeTime + ' s' : '获取验证码'}}</view>
				</view>
			</template>


		</view>

		<view class="py-2 px-3">
			<button class="text-white" style="border-radius: 50rpx;border: 0;" type="primary" :disabled="disabled" :class="disabled ? 'bg-main-disabled':'bg-main'"
			 @click="nameLogin" :loading="loading">{{loading ? 'Logining...' : 'Login'}}</button>
		</view>

		<view class="py-2 px-3">
			<button class="text-white" style="border-radius: 50rpx;border: 0;" type="primary" :disabled="disabled" :class="disabled ? 'bg-main-disabled':'bg-main'"
			 @click="nameRegist" :loading="loading">{{loading ? 'Logining...' : 'Register'}}</button>
		</view>

		<view class="flex align-center justify-center pt-2 pb-4">
			<view class="text-primary font-sm" @click="changeStatus">
				{{status?'账号密码登录':'Login with SMS verification'}}
			</view>
			<text class="text-muted mx-2">|</text>
			<view class="text-primary font-sm">Forget password?</view>
		</view>

		<view class="flex align-center justify-center">
			<view style="height: 1rpx;background-color: #dddddd;width: 100rpx;"></view>
			<view class="mx-2 text-muted">Login with other account</view>
			<view style="height: 1rpx;background-color: #dddddd;width: 100rpx;"></view>
		</view>
		<!-- 微信 -->
		<view class="oauth-row">
			<view class="oauth-image">
				<image src="/static/weixin.png" @click="oauth('weixin')"></image>
			</view>
		</view>

		<other-login back></other-login>

		<view class="flex align-center justify-center text-muted size" style="margin-top: 70rpx;">
			By registing means agree<text class="text-primary size">《Lakehead Community License》</text>
		</view>

	</view>
</template>

<script>
	import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue';
	import otherLogin from '@/components/common/other-login.vue';
	import {
		mapMutations
	} from 'vuex';

	export default {
		components: {
			uniStatusBar,
			otherLogin
		},
		data() {
			return {
				status: false,
				username: "",
				password: "",
				logining: false,
				phone: "",
				code: "",
				codeTime: 0,
				loading: false
			}
		},
		onLoad() {

		},
		computed: {
			disabled() {
				if ((this.username === '' || this.password === '') && (this.phone === '' || this.code === '')) {
					return true
				}
				return false
			}
		},
		methods: {
			...mapMutations(['login', 'token']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			nameRegist() {
				/* 数据合法性校验 */
				/* if() */
				console.log("注册")
				const {
					username,
					password
				} = this;
				console.log(this.username)
				console.log(this.password)
				uni.request({
					url: "http://3.96.104.51:53020/uaa/register/name",
					data: {
						username,
						password
					},
					method: "POST",
					timeout: 100000,
					dataType: "json",
					success: res => {
						console.log(res.data.message);
						if (res.data.code == 0) {
							this.$api.msg(res.data.message)
						} else {
							this.$api.msg(res.data.message);
						}
					},
					fail: function(e) {
						console.log(e)
					}
				})
			},
			namelogin: (user_name, pass_word) => {
				return new Promise((resolve, reject) => {
					uni.request({
						url: "http://3.96.104.51:53020/uaa/login",
						header: {
							"Content-type": "application/x-www-form-urlencoded"
						},
						data: {
							username: user_name,
							password: pass_word,
							grant_type: "password",
							client_id: "CAMPUS",
							client_secret: "SECRET",
						},
						method: "POST",
						timeout: 100000,
						dataType: "json",
						success: (infoRes) => {
							/* infoRes = JSON.parse(res) */
							console.log("login res: " + infoRes.data)
							if (infoRes.data.access_token != null) {
								uni.setStorageSync("jwt", infoRes.data.access_token);
								console.log("===login success===")
								resolve(infoRes.data.access_token);
							} else {
								reject(infoRes.data.error);
							}
						},
						fail: function(e) {
							reject(infoRes.data.error)
						}
					})
				});
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 初始化表单
			initForm() {
				this.username = ''
				this.password = ''
				this.phone = ''
				this.code = ''
			},
			// 切换登录方式
			changeStatus() {
				// 初始化表单
				this.initForm()
				this.status = !this.status
			},
			// 获取验证码
			getCode() {
				// 防止重复获取
				if (this.codeTime > 0) {
					return;
				}
				// 验证手机号
				if (!this.validate()) return;
				// 请求数据
				this.$H.post('/user/sendcode', {
					phone: this.phone
				}, {
					native: true
				}).then(res => {
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					// 倒计时
					this.codeTime = 60
					let timer = setInterval(() => {
						if (this.codeTime >= 1) {
							this.codeTime--
						} else {
							this.codeTime = 0
							clearInterval(timer)
						}
					}, 1000)
				})
			},
			// 表单验证
			validate() {
				//手机号正则
				var mPattern = /^1[34578]\d{9}$/;
				if (!mPattern.test(this.phone)) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					});
					return false
				}
				// ...更多验证
				return true
			},
			// 提交
			submit() {
				// 表单验证
				let url = ""
				let data = ""
				if (this.status) {
					// 手机验证码登录
					if (!this.validate()) return;
					url = '/user/phonelogin'
					data = {
						phone: this.phone,
						code: this.code
					}
				} else {
					// 账号密码登录
					url = '/user/login'
					data = {
						username: this.username,
						password: this.password
					}
				}
				// 提交后端
				this.loading = true
				this.$H.post(url, data).then(res => {
					this.loading = false
					console.log(res);
					// 修改vuex的state,持久化存储
					this.$store.commit('login', res)
					// 开启socket
					this.$store.dispatch('openSocket')
					// 提示和跳转
					uni.navigateBack({
						delta: 1
					});
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					});
				}).catch(err => {
					// 登录失败
					this.loading = false
				})

			},
			getinfo: (token) => {
				return new Promise((resolve, reject) => {
					let jwt = (token == undefined ? uni.getStorageSync("jwt") : token);
					console.log("jwt: " + jwt);
					uni.request({
						url: "http://3.96.104.51:53020/uaa/info",
						header: {
							Authorization: "Bearer " + jwt
						},
						method: "GET",
						timeout: 100000,
						dataType: "json",
						success: res => {
							console.log(res)
							if (res.data.code == 0) {
								uni.setStorageSync("userInfo", res.data.data)
								resolve(res.data.data)
							} else {
								uni.showToast({
									title: "失败"
								})
							}
						},
						fail: function(e) {
							reject(res.data.message)
						}
					})
				});
			},
			nameLogin() {
				/* 数据验证模块*/
				console.log("登陆")
				this.logining = true;
				this.namelogin(this.username, this.password)
					.then((token) => {
						this.token(token);
						this.getinfo(token)
					})
					.then((res) => {
						console.log(res);
						this.login(res);
						uni.navigateBack();
					})
			},

			toMain(userName) {
				this.login(userName);
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}

			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			getWeixinAccess: (value) => {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: value,
						success: (res) => {
							console.log(res)
							resolve(res.code);
						},
						fail: (err) => {
							reject(err);
						},
					})
				});
			},
			getOpenId: (code) => {
				console.log("code: " + code)
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + uni.getStorageSync("appid") + "&secret=" + uni.getStorageSync(
							"secret") + "&js_code=" + code + "&grant_type=authorization_code",
						success: (info_res) => {
							console.log("openId: " + info_res.data.openid)
							uni.setStorageSync("openId", info_res.data.openid);
							resolve()
						},
						fail: function(e) {
							uni.showToast({
								title: "获取openId失败"
							})
						}
					})
				})
			},
			getWxInfo: () => {
				return new Promise((resolve, reject) => {
					uni.getUserInfo({
						provider: "weixin",
						success: (infoRes) => {
							uni.setStorageSync("nickName", infoRes.userInfo.nickName);
							uni.setStorageSync("avatarUrl", infoRes.userInfo.avatarUrl);
						},
						fail: function(e) {
							uni.showToast({
								title: "微信第三方登陆失败"
							})
						}
					})
				});
			},
			wxRegisterRequest: () => {
				return new Promise((resolve, reject) => {
					let id = uni.getStorageSync("openId");
					let name = uni.getStorageSync("nickName");
					let url = uni.getStorageSync("avatarUrl");
					/* console.log(id + " " + name + " " + url) */
					uni.request({
						url: "http://192.168.2.26:53020/uaa/register/wx",
						data: {
							openId: id,
							nickName: name,
							avatarUrl: url
						},
						method: "POST",
						timeout: 100000,
						dataType: "json",
						success: (res) => {
							console.log(res)
							if (res.data.code == 0 || res.data.code == 2) {
								uni.showToast({
									title: "微信授权成功"
								})
							} else {
								uni.showToast({
									title: "微信授权失败"
								})
							}
						},
						fail: function(e) {
							console.log(e)
						}
					})
				})
			},
			oauth: function(value) {
				/* uni.showLoading({
					title: "授权登录中..."
				}) */
				this.getWeixinAccess(value)
					.then((code) => {
						this.getOpenId(code)
					})
					.then(() => {
						this.getWxInfo()
					})
					.then(() => {
						this.wxRegisterRequest()
					})
					.then(() => {
						let id = uni.getStorageSync("openId");
						this.namelogin(id, id)
					})
					.then((token) => {
						this.getinfo(token)
					})
					.then((res) => {
						console.log(res);
						this.login(res);
						uni.navigateBack();
					})

			}
		}
	}
</script>

<style>
	.size {
		font-size: 12px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;

		left: 0px;
		width: 100%;
	}

	.oauth-image {
		position: relative;
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		margin: 0 20px;
		background-color: #ffffff;
	}

	.oauth-image image {
		position: absolute;
		top: 0px;
		width: 30px;
		height: 30px;
		margin: 10px;
	}

	.oauth-image button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
