<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<navigator url="../login/login">
			<view class="iconfont icon-quxiao" style="size: 40rpx;" @click="navBack"></view>
		</navigator>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				Welcome back！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">用户名</text>
					<input 
						type="text"
						:value="username" 
						placeholder="请输入用户名"
						maxlength="20"
						data-key="username"
						@input="inputChange"
					/>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input 
						type="password" 
						value="" 
						placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty"
						maxlength="20"
						password 
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="nameLogin" :disabled="logining">登录</button>
			<button class="confirm-btn" @click="nameRegist" :disabled="logining">注册</button>
			<view class="forget-section">
				忘记密码（暂不开放）?
			</view>
		</view>
		<view class="oauth-row" v-bind:style="{top: positionTop + 'px'}">
			<view class="oauth-image">
				<image src="/static/weixin.png" @click="oauth('weixin')" ></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	
	export default{
		data(){
			return {
				username: '',
				password: '',
				logining: false,
				positionTop: 0,
				isDevtools:false,
			}
		},
		onLoad(){
			
		},
		methods: {
			...mapMutations(['login','token']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			nameRegist(){
				/* 数据合法性校验 */
				/* if() */
				const {username, password} = this;
				uni.request({
					url:"http://192.168.2.26:53020/uaa/register/name",
					data: {username, password},
					method:"POST",
					timeout: 100000,
					dataType:"json",
					success:res => {
						if(res.data.code == 0){
							this.$api.msg(res.data.message)
						}else{
							this.$api.msg(res.data.message);
						} 
					},
					fail: function(e){
						console.log(e)
					}
				})
			},
			namelogin: (user_name, pass_word) => {
			    return new Promise((resolve, reject) => {
			        uni.request({
			        	url:"http://192.168.2.26:53020/uaa/login",
			        	header:{"Content-type":"application/x-www-form-urlencoded"},
			        	data: {
			        		username:user_name,
			        		password:pass_word, 
			        		grant_type:"password", 
			        		client_id:"CAMPUS", 
			        		client_secret:"SECRET",
			        	},
			        	method:"POST",
			        	timeout: 100000,
			        	dataType:"json",
			        	success:(infoRes) => {
							console.log("login res: " + infoRes.data)
			        		if(infoRes.data.access_token != null){
								uni.setStorageSync("jwt", infoRes.data.access_token);
								console.log("===login success===")
								resolve(infoRes.data.access_token);
			        		}else{
								reject(infoRes.data.error);
			        		} 
			        	},
			        	fail: function(e){
			        		reject(infoRes.data.error)
			        	}
			        })
			    });
			},
			getinfo:(token)=>{
				return new Promise((resolve, reject) => {
					let jwt = (token == undefined?uni.getStorageSync("jwt"):token);
					console.log("jwt: " + jwt);
					uni.request({
						url:"http://192.168.2.26:53020/uaa/info",
						header:{Authorization: "Bearer " + jwt},
						method:"GET",
						timeout: 100000,
						dataType:"json",
						success:res => {
							console.log(res)
							if(res.data.code == 0){
								uni.setStorageSync("userInfo", res.data.data)
								resolve(res.data.data)
							}else{
								uni.showToast({
									title: "失败"
								})
							} 
						},
						fail: function(e){
							reject(res.data.message)
						}
					})
				});
			},
			nameLogin(){
				/* 数据验证模块*/		
				this.logining = true;
				this.namelogin(this.username, this.password)
					.then((token)=>{this.token(token); this.getinfo(token)})
					.then((res)=>{this.login(res); uni.navigateBack();})
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
						url:"https://api.weixin.qq.com/sns/jscode2session?appid=" + uni.getStorageSync("appid") + "&secret=" + uni.getStorageSync("secret") + "&js_code=" + code + "&grant_type=authorization_code",
						success: (info_res) => {
							console.log("openId: " + info_res.data.openid)
							uni.setStorageSync("openId", info_res.data.openid);
							resolve()
						},
						fail: function(e){
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
			wxRegisterRequest:() => {
				return new Promise((resolve, reject) => {
					let id = uni.getStorageSync("openId");
					let name = uni.getStorageSync("nickName");
					let url = uni.getStorageSync("avatarUrl");
					/* console.log(id + " " + name + " " + url) */
					uni.request({
						url:"http://192.168.2.26:53020/uaa/register/wx",
						data: {openId:id, nickName:name, avatarUrl: url},
						method:"POST",
						timeout: 100000,
						dataType:"json",
						success:(res) => {
							console.log(res)
							if(res.data.code == 0 || res.data.code == 2){
								uni.showToast({
									title: "微信授权成功"
								})
							}else{
								uni.showToast({
									title: "微信授权失败"
								})
							} 
						},
						fail: function(e){	
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
					.then((code)=>{this.getOpenId(code)})
					.then(()=>{this.getWxInfo()})
					.then(()=>{this.wxRegisterRequest()})
					.then(()=>{let id = uni.getStorageSync("openId"); this.namelogin(id, id)})
					.then((token)=>{this.getinfo(token)})
					.then((res)=>{console.log(res);this.login(res); uni.navigateBack();})
			
			}		
		},
		onReady(){
			this.initPosition();
		}
	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 30upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0px;
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
