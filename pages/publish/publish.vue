<template>
	<view>
		<view class="header">
			<block class="iner-header">
				<image class="image-size" src="../../static/lakeheadLogo.png" mode="aspectFit" lazy-load=""></image>
			</block>
		</view>
		<view class="container">

			<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
			<view class="wrapper">
				<view class="input-content">
					<view class="input-item">
						<text class="tit">Title</text>
						<input type="text" :value="item_name" placeholder="please input item name" placeholder-class="cl" maxlength="30"
						 data-key="item_name" @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">Price</text>
						<input type="digit" :value="item_price" placeholder="unit: CAD$" placeholder-class="cl" maxlength="10" data-key="item_price"
						 @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">Description</text>
						<textarea type="text" v-model="item_desc" placeholder="please input item description" placeholder-class="cl" style="height: 200upx;"
						 @input="inputChange" />

						</view>
			</view>
			<imgUpload :imgArr="imgArray" imgCount="3" ref="imgUpload"></imgUpload>
			<button class="confirm-btn" @click="submit">Submit</button>
		</view>
	</view>
	</view>
</template>

<script>
	import imgUpload from '@/components/poiuy-uImgUpload/imgUpload.vue'
	import {  
        mapMutations  
    } from 'vuex';
	export default{
		components:{
			imgUpload
		},
		data(){
			return {
				imgArray:[],
				item_name:"",
				item_price:"",
				item_desc:""
			}
		},
		onLoad(){
			
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
				console.log(this.item_desc)
			},
			uploadItem:(item_name,item_price,item_desc)=>{
				return new Promise((resolve, reject) => {
					let jwt = uni.getStorageSync("jwt");
					console.log("jwt: " + jwt);
					uni.request({
						url:"http://3.96.104.51:53020/item/create",
						header:{Authorization: "Bearer " + jwt},
						data: {
							productName:item_name, 
							productDesc:item_desc, 
							productPrice:item_price,
							imgAddr: ""
						},
						method:"POST",
						timeout: 100000,
						dataType:"json",
						success:res => {
							console.log(res)
							console.log(res.data.code)
							if(res.data.code == 200){
								resolve(res.data.data)
							}else{
								uni.showToast({
									title: "Please login"
								})
							} 
						},
						fail: function(e){
							reject(res.data.message)
						}
					})
				});
			},
			submit(){
				this.uploadItem(this.item_name, this.item_price, this.item_desc)
					.then((item_id) => {
						this.$refs.imgUpload.upload(item_id, res=>{
							
									   if(res.code==0){
									   		//0为正常返回，将回调的线上图片数组 赋值给需要提交的表单里
											//res.urlArray 线上路径图片数组
											//TODO
											uni.showToast({
												title: "商品上传成功"
											})
											this.item_desc = null
											this.item_price =""
											this.item_name = ""
										}else{
											uni.showToast({
												title: "商品上传失败"
											})
										}
						});
					})
				/* this.$refs.imgUpload.upload(res=>{
							   if(res.code==0){
							   		//0为正常返回，将回调的线上图片数组 赋值给需要提交的表单里
									//res.urlArray 线上路径图片数组
									//TODO
								}else{
									//用户没有上传图片的返回 code码为400
								}
				}); */
			}
		},
		onReady(){
		}
	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 2px;
		position:relative;

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
	.input-content{
		padding: 0 30upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 10upx;
		/* background:#e3f6f9; */
		border: 1upx solid #d4d8d8;
		border-radius: 4px;
		margin-bottom: 20upx;
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
		textarea{
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
		margin-top: 100upx;
		background: #69acff;
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
	.cl{
		color: #c0c4c4;
	}
	.header{
		margin-bottom: 40upx;
		background-color: #39b1ff;
		
	}
	.image-size{
		height: 60upx;
	    margin-top: 13upx;
		margin-left: 58upx;
	}
</style>
