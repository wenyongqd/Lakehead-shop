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
	//import $config from "@/appConfig.js"; //调用url前缀 *注意修改为自己的！！！
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
			/* 一次上传一张或者多张图片 */
			upPhoto() {
				let that = this;
				if (Number(that.imgCount - that.imgArray.length) < Number(that.uploadImgCount)) {
					that.canUpCount = Number(that.imgCount - that.imgArray.length);
				}
				uni.showActionSheet({
					itemList: ['拍照上传', '从相册中选择'],
					success: function(res) {
						if (res.tapIndex == 0) {
							uni.chooseImage({
								count: Number(that.canUpCount),
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['camera'], //从相册选择
								success: function(res) {
									if (res) {
										if (res.tempFiles) {
											for (let item of res.tempFiles) {
												if (item.size > (that.imgSize * 1024 * 1024)) {
													uni.showToast({
														title: `图片不能大于${that.imgSize}M`,
														icon: 'none'
													})
													return false;
												}
												if(item.type){
													let r = that.imgType.some(v => {
														let type = item.type.split('/');
														if (type.length)
															return (v === type[1]);
													});
													if (!r) {
														uni.showToast({
															title: `只允许上传${that.imgType}的类型`,
															icon: 'none'
														})
														return false;
													}
												}
											}
										}
										that.imgArray = [...that.imgArray, ...res.tempFilePaths];
									}
								}
							});
						} else if (res.tapIndex == 1) {
							uni.chooseImage({
								count: Number(that.canUpCount),
								sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
								sourceType: ['album'], //从相册选择
								success: function(res) {
									if (res) {
										if (res.tempFiles) {
											for (let item of res.tempFiles) {
												if (item.size > (that.imgSize * 1024 * 1024)) {
													uni.showToast({
														title: `图片不能大于${that.imgSize}M`,
														icon: 'none'
													})
													return false;
												}
												if(item.type){
													let r = that.imgType.some(v => {
														let type = item.type.split('/');
														if (type.length)
															return (v === type[1]);
													});
													if (!r) {
														uni.showToast({
															title: `只允许上传${that.imgType}的类型`,
															icon: 'none'
														})
														return false;
													}
												}
											}
										}
										that.imgArray = [...that.imgArray, ...res.tempFilePaths];
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
				const _this = this;
				uni.showModal({
					title: '提示',
					content: '是否删除这张照片？',
					success: function(res) {
						if (res.confirm) {
							_this.imgArray.splice(i, 1);
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
					// console.log('休眠后：' + new Date().getTime());
			},

			upload(item_id, callback) {
				console.log("itemid: " + item_id)
				const _this = this;
				console.log(_this.imgArray.length);
				if (_this.imgArray.length) {
					this.startUpload=true;
					let successNum = 0;
					let urlArr = [];
					for (let item of _this.imgArray) {
						console.log(item);
						this.sleep(1000);
						_this.uploadImg(item, item_id, res => {
							if (res.code == 0) {
								successNum++;
								urlArr.push(res.message);
							} else {
								urlArr.push(res.message);
							}
							if (urlArr.length == _this.imgArray.length) {
								if(successNum>0){
									this.startUpload=false;
									_this.imgArray = [];
									callback(_this.result(urlArr, successNum));
								}else{
									this.startUpload=false;
									callback(urlArr); //错误的返回
								}
							}
						});
					}
				} else {
					callback({
						result: 'warning',
						code: 400,
						msg: '请先上传图片！'
					});
				}
			},

			result(urlArr, successNum) {
				let result = {
					result: 'success',
					code: 0,
					urlArray: urlArr,
					success: successNum
				}
				return result;
			},

			uploadImg(item, item_id, callback) {
				console.log("upload img with item_id: " + item);
				const _this = this;
				uni.uploadFile({
					header: {Authorization: "Bearer " + uni.getStorageSync("jwt")},
					url:'http://3.96.104.51:53020/s3/item', //需传后台图片上传接口
					filePath: item,
					name: "multipartFile",
					formData: {itemId: item_id},
					success: (uploadFileRes) => {
						if (uploadFileRes) {
							let res = JSON.parse(uploadFileRes.data);
							callback(res);
						}
					},
					fail:(e)=>{
						callback({
							code:500,
							msg:'图片上传失败',
							localUrl:item,
							reason:e
						});
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
