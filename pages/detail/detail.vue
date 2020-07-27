<template>
	<view>
		<swiper class="swiper" :indicator-dots="true">
			<swiper-item v-for="(item,index) in bannerList">
				<image :src="bannerList[index]" mode="scaleToFill" style="height: 100%; width: 100%;;"></image>
			</swiper-item>
		</swiper>
		
		<view class="user-info u-f-ac">
			<view class="u-f-ac">
				<image :src="info.userpic" 
				mode="widthFix" 
				lazy-load=""></image>
				{{info.username}}
			</view>
			<view class="u-f-ac" @tap="guanzhu">
				<view class="icon iconfont icon-icon-test" >
					<block v-if="isguanzhu === false ? true : false">{{shoucang}}</block>
					<block v-else>{{yishoucang}}</block>
				</view>
			</view>
		</view>

		<view class="text" v-html="info.description"></view>
		<!-- 评论 -->

		<divider></divider>
		<view class="p-2 font-md font-weight-bold">
			Comments: <!-- {{comments.length}} -->
		</view>
		<view class="px-2">
			
			<view class="uni-comment-list">
				<view style="width: 60rpx;"></view>
				<view class="flex w-100"
				>
					<view><image class="uni-comment-face2" :src="info.userpic"></image></view>
					<view class="uni-comment-body">
						<view class="uni-comment-top">
							<text><!-- {{item.username}} -->wenyongqd</text>
						</view>
						<view class="uni-comment-content"
						@click="reply(item.id)"><!-- {{item.data}} -->Hi, I like this product, how much? </view>
						<view class="uni-comment-date">
							<view><!-- {{item.time}} -->2020-7-23 19:23</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<bottom-input></bottom-input>
		
	</view>
	

		
</template>

<script>
	import bottomInput from "../../components/common/bottom-input.vue"
	import divider from "../../components/common/divider.vue"
	export default {
		components: {
			bottomInput,
			divider
		},

		data() {
			return {
				shoucang:"收藏",
				yishoucang:"已收藏",
				bannerList:[],
		
				info:{
					userpic:"",
					username:"111",
					isguanzhu:false,
					title:"",
					type:"",
					titlepic:"",
					images:[],
					infonum: {
						index:1, //0:没有操作;1:顶;2:踩
						zan:11,
						cai:1,
					},
					description:"",
					createdtime:"",
					commentNum:10,
					sharenum:10
				},	
			}
		},
		methods:{
			__init(data){
				// 修改标题
				// uni.setNavigationBarTitle({
				// 	title:data.title
				// })
				console.log(data.username)
				this.info = data
				this.bannerList = data.images
				// this.info.content = ''
				// // 请求api
				// this.$H.get('/post/'+this.info.id).then(res=>{
				// 	this.info.content = res.detail.content
				// 	this.images = res.detail.images
				// 	console.log(res);
				// })
				// this.getComments()
			},
			guanzhu(){
				if (this.isguanzhu===false) {
					this.isguanzhu=true;
					uni.showToast({
						title:'收藏成功'
					});
				} 
			},
		},
		onLoad(e){
			console.log(e.detail)
			console.log(JSON.parse(e.detail))
			if (e.detail) {
				this.__init(JSON.parse(e.detail))
			}
			// this.info = e.detail
			// this.userpic = e.detail.userpic
			// this.username = e.detail.username
			// this.isguanzhu = e.detail.isguanzhu
			// this.title = e.detail.title
			// this.type = e.detail.type
			// this.titlepic = e.detail.titlepic
			// this.images = e.detail.images
			// this.infonum = e.detail.infonum
			// this.description = e.detail.description
			// this.createdTime = e.detail.createdTime
			// this.bannerList = e.detail.images
			// console.log(this.info)
		}
	}
</script>

<style>
	.uni-comment-face2{
		width: 85upx;
		height: 85upx;
		border-radius: 15%;
		margin-right: 10upx;
	}
	.swiper{
		height: 600upx;
	}
	.text{
		margin-top: 30upx;
		margin-left: 15upx;
		margin-right: 15upx;
		font-size: 30upx;
		margin-bottom: 200upx;
	}
	.user-info{
		padding: 20upx;
		border-bottom: 1upx solid #EFEFEF;
		font-style: ;
	}
	.user-info{
		justify-content: space-between;
		
	}
	.user-info>view:first-child{
		color: #999999;
		font-size: 32upx;
	}
	.user-info>view:first-child image{
		width: 85upx;
		height: 85upx;
		border-radius: 100%;
		margin-right: 10upx;
	}
	.user-info>view:last-child{
		background-color: #F4F4F4;
		border-radius: 5ups;
		padding: 0 10upx;
		color: #949494;
	}
</style>
