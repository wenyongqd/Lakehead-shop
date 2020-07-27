<template>
	<view class="w-100">
		<view class="w-100 flex_wrap">
			<view class="imgs-view" v-for="(v,i) in imgArray" :key="i">
				<image @click="preview(v,i)" :src="v"></image>
				<view class="del-btn" @click="delImg(i)">
					<image src="@/static/delete.png"></image>
				</view>
				<view class="uploading flex_xy_center" v-if="closeLoading&&startUpload">
					<view><image src="@/static/uploading4.png"></image>
					<view class="upload-txt">上传中...</view></view>
				</view>
			</view>
			<view v-if="imgArray.length<imgCount" class="upload-img-view flex_xy_center" @click="upPhoto">
				<image src="@/static/jia.png"></image>
			</view>
		</view>
		<view v-if="!closeTip" class="tip">* The first image will be shown on the index, please upload maxmium with {{imgCount}} images (<label>  {{imgArray.length}} </label>/{{imgCount}} )</view>
	</view>
</template>

<script>
	export default {
		name: 'imgUpload',
		props: {
			imgArr: { //图片数组
				type: [Array],
			},
			uploadImgCount: { //一次上传图片数
				type: String,
				default: '3'
			},
			imgCount: { //可上传图片总数
				type: String,
				default: '3'
			},
			imgSize: { //图片大小 单位M
				type: Number,
				default: 4
			},
			imgType: {  //如果是小程序，这个值则没用作用
				type: [Array],
				default: function() {
					return ['jpeg', 'png', 'jpg']
				}
			},
			closeTip: {
				type: Boolean,
				default: false,
			},
			closeLoading: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				itemId: [],
				imgArray: [],
				canUpCount:'',
				startUpload:false,
			}
		},
		created() {
			this.imgArray = this.imgArr;
			
			this.canUpCount = Number(this.uploadImgCount);
		},
		watch: {
			imgArr(n,o){
				this.imgArray = n;
			},
		},
		methods: {
			/* 一次上传一张图片 */
			upPhoto() {
				if (Number(this.imgCount - this.imgArray.length) < Number(this.uploadImgCount)) {
					this.canUpCount = Number(this.imgCount - this.imgArray.length);
				}
				uni.showActionSheet({
					itemList: ['Take Phone', 'Choose From Album'],
					success: (res) => {
						if (res.tapIndex == 0) {
							uni.chooseImage({
								count:1,
								sizeType: ['original', 'compressed'],
								sourceType: ['camera'], 
								success: (res) => {
									if (res) {
										if (res.tempFiles) {
											for (let item of res.tempFiles) {
												if (item.size > (this.imgSize * 1024 * 1024)) {
													uni.showToast({
														title: `Image Size is Limited under ${this.imgSize}M`,
														icon: 'none'
													})
													return false;
												}
												if(item.type){
													let r = this.imgType.some(v => {
														let type = item.type.split('/');
														if (type.length)
															return (v === type[1]);
													});
													if (!r) {
														uni.showToast({
															title: `Only accept ${this.imgType} Types`,
															icon: 'none'
														})
														return false;
													}
												}
											}
										}
										this.upload(uni.getStorageSync("itemId"), res.tempFilePaths);
									}
								}
							});
						} else if (res.tapIndex == 1) {
							uni.chooseImage({
								count: 1,
								sizeType: ['original', 'compressed'],
								sourceType: ['album'], 
								success: (res) => {
									if (res) {
										if (res.tempFiles) {
											for (let item of res.tempFiles) {
												if (item.size > (this.imgSize * 1024 * 1024)) {
													uni.showToast({
														title: `图片不能大于${this.imgSize}M`,
														icon: 'none'
													})
													return false;
												}
												if(item.type){
													let r = this.imgType.some(v => {
														let type = item.type.split('/');
														if (type.length)
															return (v === type[1]);
													});
													if (!r) {
														uni.showToast({
															title: `只允许上传${this.imgType}的类型`,
															icon: 'none'
														})
														return false;
													}
												}
											}
										}
										this.upload(uni.getStorageSync("itemId"), res.tempFilePaths);
									}
								}
							});
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			preview(url, index) {
				// 预览图片
				uni.previewImage({
					urls: [url]
				});
			},
			delImg(i) {
				uni.showModal({
					title: 'Attention',
					content: 'Delete this Image？',
					success: (res)=> {
						if (res.confirm) {
							let auth = "Bearer " + uni.getStorageSync("jwt")
							let myoptions = {
								header:{
									"content-type":"application/x-www-form-urlencoded",
									"Authorization": auth
								}
							};
							let data = {
								itemId:uni.getStorageSync("itemId"),
								imgUrl:this.imgArray[i]
							};
							this.$H.del('/item/image', data, myoptions).then(res => {
								let [err, result] = res
								if(result.data.code == 200){
									this.imgArray.splice(i, 1);
								}
							});
						} else if (res.cancel) {}
					}
				});
			},
			sleep(n) {
				var start = new Date().getTime();
				//  console.log('休眠前：' + start);
				while (true) {
					if (new Date().getTime() - start > n) {
						break;
					}
				}
			},
			upload(item_id, filepaths) {
				this.startUpload=true;
				this.sleep(100);
				this.uploadImg(filepaths[0], item_id);
			},
			uploadImg(item, item_id) {
				uni.showLoading({
				    title: 'Uploading...'
				});
				const _this = this;
				uni.uploadFile({
					header: {Authorization: "Bearer " + uni.getStorageSync("jwt")},
					url:'http://3.96.104.51:53020/s3/item', //需传后台图片上传接口
					filePath: item,
					name: "multipartFile",
					formData: {itemId: item_id},
					success: (uploadFileRes) => {
						if (uploadFileRes) {
							console.log("uploadFileRes: " + uploadFileRes)
							let res = JSON.parse(uploadFileRes.data);
							console.log(res.message)
							this.startUpload=false;
							if (res.code == 0) {
								this.imgArray.push(res.message);
								uni.hideLoading();
								uni.showToast({
									title: "Image Uploaded Successfully"
								})
							} else {
								uni.hideLoading();
								uni.showToast({
									title: "Upload Fall 1"
								})
							}		
						}
					},
					fail:(e)=>{
						console.log(e)
						uni.hideLoading();
						uni.showToast({
							title: "Upload Fall 2"
						})
					}
				});
			}
		}
	}
</script>

<style scoped>
	.w-100 {
		width: 100%;
		margin-top: 30upx;
	}


	.flex {
		/* 转为弹性盒模型*/
		display: flex;
		
	}

	.flex_bet {
		/* 两端左右*/
		display: flex;
		justify-content: space-between;
	}

	.flex_wrap {
		/* 转为弹性盒模型并自动换行*/
		display: flex;
		flex-wrap: wrap;
	}
	
	.flex_xy_center{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-img-view {
		height: 200upx;
		width: 30%;
		border-radius: 10upx;
		margin-left: 2.5%;
		border: 4upx dotted #F1F1F1;
		/* background-color: #F1F1F1; */
	}

	.upload-img-view>image {
		width: 70upx;
		height: 70upx;
	}

.upload-txt{
	font-size: 24upx;
	color: #FFFFFF;
}
	.imgs-view {
		height: 200upx;
		width: 30%;
		border-radius: 10upx;
		margin-left: 2.5%;
		margin-bottom: 16upx;
		border: 2upx solid #F1F1F1;
		box-sizing: border-box;
		position: relative;
	}

	.uploading{
		position: absolute;
		background-color: rgba(0,0,0,.5);
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 100%;
		z-index: 999;
	}
	
	.uploading image{
		width: 60upx;
		height: 60upx;
		z-index: 1000;
		animation: rotation .6s linear infinite;
		-moz-animation: rotation .6s linear infinite;
		-webkit-animation: rotation .6s linear infinite;
		-o-animation: rotation .6s linear infinite;
	}
	
	
	@keyframes rotation {
		from {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-o-transform: rotate(0deg);
		}
	
		to {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
			-moz-transform: rotate(360deg);
			-o-transform: rotate(360deg);
		}
	}
	
	.imgs-view>image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
	}

	.tip {
		font-size: 26upx;
		color: #999999;
		margin-top: 16upx;
		margin-left: 2.5%;
	}

	.tip>label {

		margin-left: 3px;
		color: #FF0000;
	}

	.del-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 32upx;
		height: 32upx;
		z-index: 999;
	}

	.del-btn>image {
		width: 100%;
		height: 100%;
		display: flex;
	}
</style>

