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
			
<!-- 			<view class="uni-comment-list" v-for="(item,index) in comments"
			:key="index">

				<view class="flex w-100">
					<view style="width: 60rpx;"></view>
					<view class="flex w-100"
					>
						<view><image class="uni-comment-face2" :src="info.userpic"></image></view>
						<view class="uni-comment-body">
							<view class="uni-comment-top">
								<text>wenyongqd</text>
							</view>
							<view class="uni-comment-content"
							@click="reply(item.id)">Hi, I like this product, how much? </view>
							<view class="uni-comment-date">
								<view>2020-7-23 19:23</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="px-2"> -->
			
			<view class="uni-comment-list" v-for="(item,index) in comments"
			:key="index">
				<view v-if="item.fid" style="width: 60rpx;"></view>
				<view class="flex w-100"
				:class="item.fid ? 'bg-light rounded p-2' : ''">
					<view style="width: 60rpx;"></view>
					<view class="flex w-100"
					>
						<view><image class="uni-comment-face2" :src="info.userpic"></image></view>
						<view class="uni-comment-body">
							<view class="uni-comment-top">
								<text>{{info.username}}</text>
							</view>
							<view class="uni-comment-content"
							@click="reply(item.id)">{{item.data}}</view>
							<view class="uni-comment-date">
								<view>{{item.createTime}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<bottom-input :focus="focus" @blur="blur" @submit="submit"></bottom-input>
		
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
					productId:"",
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
				images:[],
				comments:[],
				focus:false,
				reply_id:0
			}
		},
		methods:{
			__init(data){
				// 修改标题
				// uni.setNavigationBarTitle({
				// 	title:data.title
				// })
				console.log(JSON.stringify(data))
				console.log(data.username)
				this.info = data
				this.bannerList = data.images
				this.getComments()
				// this.info.content = ''
				// // 请求api
				// this.$H.get('/post/'+this.info.id).then(res=>{
				// 	this.info.content = res.detail.content
				// 	this.images = res.detail.images
				// 	console.log(res);
				// })
				// this.getComments()
			},
			//提交评论
			submit(data){
				console.log("我正在评论")
				if (data === '') {
					return uni.showToast({
						title: 'Please write a comment',
						icon: 'none'
					});
				}
				console.log(this.info.productId)
				this.$H.post('/item/'+this.info.productId+'/comment',this.$qs.stringify({
					fid:0,
					data:data,
					post_id:this.info.productId
				})).then (res => {
					console.log(res)
					this.getComments()
				})
				
			},
			guanzhu(){
				if (this.isguanzhu===false) {
					this.isguanzhu=true;
					uni.showToast({
						title:'收藏成功'
					});
				} 
			},
			// 获取评论列表
			getComments(){
				this.$H.get('/item/'+this.info.productId+'/comments')
				.then(res=>{
					let [err, result] = res
					console.log(JSON.stringify(result.data.data));
					// result = JSON.stringify(result.data.data)
					console.log(result)
					console.log(result.data.data.length);
					console.log(this.comments)
					// this.comments = this.__ArrSort(result)
					this.comments = result.data.data
					console.log(this.comments)
					console.log(JSON.stringify(this.comments))
					// this.info.comment_count = this.comments.length
					// uni.$emit('updateCommentsCount',{
					// 	id:this.info.id,
					// 	count:this.info.comment_count
					// })
				})
			},
		},
		__ArrSort(arr,id = 0){
			console.log("进入排序")
			var temp = [],lev=0;
			var forFn = function(arr, id,lev){
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (item.fid==id) {
						item.lev=lev;
						temp.push({
							id:item.id,

							fid:item.fid,
							userid:item.userId,
							// userpic:item.user.userpic,
							// username:item.user.username,
							// time:$T.gettime(item.create_time),
							time:item.createdTime,
							data:item.data,
						});
						forFn(arr,item.productId,lev+1);
					}
				}
			};
			forFn(arr, id,lev);
			return temp;
		},
		// 回复评论
		reply(id){
			this.reply_id = id
			this.focus = true
		},
		// 输入框失去焦点
		blur(){
			this.reply_id = 0
			this.focus = false
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
