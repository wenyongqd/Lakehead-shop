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
						<input type="text" :value="item.title" placeholder="please input item name" placeholder-class="cl" maxlength="30"
						 data-key="title" @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">Price</text>
						<input type="digit" :value="item.price" pl placeholder="Negotiable/面议 unit: CAD$" placeholder-class="cl" maxlength="10" 
						 data-key="price" @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">Description</text>
						<textarea type="text" v-model="item.description" placeholder="please input item description" placeholder-class="cl" style="height: 200upx;"
						  data-key="description" @input="inputChange" />
						</view>
			</view>
			<imgUpload :imgArr="item.images" imgCount="3" ref="imgUpload"></imgUpload>
			<button class="confirm-btn" @click="submit">Submit Edit</button>
		</view>
	</view>
	</view>
</template>

<script>
	import imgUpload from '@/components/modifoed-imgChange/modifoed-imgChange.vue'
	import {  
        mapMutations  
    } from 'vuex';
	export default{
		components:{
			imgUpload
		},
		data(){
			return {		
				item:{
				},
			}
		},
		onLoad(e){
			console.log(e)
			if (e.detail) {
				this.__init(JSON.parse(e.detail))
			}
		},
		methods: {
			__init(data){
				this.item = data
				uni.setStorageSync("itemId", data.productId)
				/* lazyload given an empty image, remove it */
				if(this.item.images[0].search("philocampus.s3.ca-central-1.amazonaws.com") == -1 ){
					this.item.images = [];
				}
			},
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				console.log(key + "  is  "+ e.detail.value)
				this.item[key] = e.detail.value;
				console.log(this.item.title)
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			uploadItem(item_id, item_name,item_price,item_desc) {
				let auth = "Bearer " + uni.getStorageSync("jwt");
				let options = {
					header:{
						"content-type":"application/x-www-form-urlencoded",
						"Authorization": auth
					}
				};
				let data={
					itemId:item_id,
					productName:item_name, 
					productDesc:item_desc, 
					productPrice:item_price,
					enableStatus:1
				}
				this.$H.put('/item/item', data, options).then(res => {
					let [err2, result] = res
					console.log(result)
					if(result.data.code == 200){
						uni.showToast({title: "Updated!"});
						this.back();
					}else{
						uni.showToast({
							title: "Server Error happened, please feedback and report it"
						})
					} 
				});
			},
			submit(){
				this.uploadItem(
					//Number(uni.getStorageSync("itemId")),
					this.item.productId,
					this.item.title, 
					this.item.price, 
					this.item.description);
			}
		},
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

