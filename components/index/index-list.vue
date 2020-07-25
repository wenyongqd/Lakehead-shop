<template>
	<view class="index-list animate__fadeInLeft animate__fast">
		<view class="index-list1 u-f-ac">
			<view class="u-f-ac">
				<image :src="item.userpic" 
				mode="widthFix" 
				lazy-load=""></image>
				{{item.username}}
			</view>
			<view class="u-f-ac" @click="guanzhu">
				<view class="icon iconfont animated icon-icon-test animated" >
					<block v-if="item.isguanzhu === false ? true : false">{{shoucang}}</block>
					<block v-else>{{yishoucang}}</block>
				</view>
			</view>
		</view>
		<view class="index-list2" @tap="opendetail">{{item.title}}</view>
		<view class="index-list3" @tap="opendetail">
			<image :src="item.titlepic" 
			mode="widthFix" 
			lazy-load=""></image>
		</view>
		<view class="index-list4 u-f-ac">
			<view class="u-f-ac">
				<view class="u-f-ac" :class="{'active':item.infonum.index==1}"
				@tap="caozuo('zan')">
					<view class="icon iconfont icon-zan animated"></view>{{item.infonum.zan}}</view>
				<view class="u-f-ac" :class="{'active':item.infonum.index==2}"
				@tap="caozuo('cai')">
					<view class="icon iconfont icon-cai animated"></view>{{item.infonum.cai}}</view>
			</view>
			<view class="u-f-ac">
				<view class="u-f-ac">{{item.createdTime}}</view>
			</view>
		</view>			
		
	</view>
</template>

<script>
	export default {
		props: {
			item:Object,
			index:Number
		},
		data () {
			return {
				shoucang:"Follow",
				yishoucang:"Fellowed",
			}
		},
		methods:{
			//关注
			guanzhu(){		
				if (this.item.isguanzhu===false) {
					this.item.isguanzhu=true;
					uni.showToast({
						title:'Followed successfully'
					});
				} 
			},
			caozuo(type){
				switch (type){
					case "zan":
						console.log("正在操作zan")
						if(this.item.infonum.index==1){return;}
						if(this.item.infonum.index==2){
							this.item.infonum.zan++;
							this.item.infonum.cai--
						}
						this.item.infonum.index=1;
						break;
					case "cai":
						if(this.item.infonum.index==1){
							this.item.infonum.zan--;
							this.item.infonum.cai++
						}
					
						if(this.item.infonum.index==2){
							return
						}
						this.item.infonum.index=2;
						break;
				}
				// let index = (type === 'zan') ? 1 : 2; // 操作后的状态
				// if(this.item.infonum.index === index) return; // 状态相同不修改
			},
			// 进入详情页
			opendetail(){
				console.log("进入了。。。")
				console.log(JSON.stringify(this.item))
				uni.navigateTo({
					url: '../../pages/detail/detail?detail='+JSON.stringify(this.item),
					// url: '../../pages/detail/detail',
				});
				// this.User.addHistoryList(this.item);
			}
		}
	}
</script>

<style scoped>
	
	.index-list{
		padding: 20upx;
		border-bottom: 1upx solid #EFEFEF;
		font-style: ;
	}
	.index-list1{
		justify-content: space-between;
	}
	.index-list1>view:first-child{
		color: #999999;
		font-size: 32upx;
	}
	.index-list1>view:first-child image{
		width: 85upx;
		height: 85upx;
		border-radius: 15%;
		margin-right: 10upx;
	}
	.index-list1>view:last-child{
		border-radius: 10upx;
		background-color: #f2549f;
		border-radius: 5ups;
		padding: 0 10upx;
		color: #ffffff;
	}
	
	.index-list2{
		padding-top: 15upx;
		font-size: 32upx;
	}
	.index-list3{
		padding-top: 15upx;
	}
	.index-list3>image{
		width: 100%;
		border-radius: 20upx;
	}
	.index-list4 view{
		color: #999999;		
	}
	.index-list4{
		margin-left: 10upx;
		padding: 10upx 0;
		justify-content: space-between;
	}
	.index-list4>view>view>view{
		margin-right: 7upx;
	}
	.index-list4>view>view:first-child{
		margin-right: 20upx;
	}
	.index-list4 .active,.index-list4 .active>view{
		color: #FF0033;
	}
	
</style>
