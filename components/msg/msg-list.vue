<template>
		<view class="list" hover-class="bg-light" @click="open">
			<image :src="item.avatar"
			style="height: 80rpx;width: 80rpx;"
			class="rounded-circle"></image>
			<view class="list1">
				<view class="list2">
					<text class="text-m">{{item.username}}</text>
					<text class="font-sm">{{item.updatedAt | formatTime}}</text>
				</view>
				<view class="list3">
					<text class="text-secondary text-ellipsis" style="max-width: 500rpx;">{{item.data}}</text>
					<uni-badge :text="item.unreadNo" type="error"></uni-badge>
				</view>
			</view>
		</view>
</template>

<script>
	import uniBadge from '@/components/uni-ui/uni-badge/uni-badge.vue'
	import $T from '../../common/time.js'
	export default {
		components:{
			uniBadge
		},
		props:{
			item:Object,
			index:Number
		},
		filters:{
			formatTime(value) {
				return $T.gettime(value)
			}
		},
		methods:{
			//打开聊天页
			open(){
				uni.navigateTo({
					url: '../../pages/user-chat/user-chat'
				});
			}
		}
	}
</script>

<style>
	.list{
		align-items: center;
		display: flex;
		padding: 20rpx;
		border-bottom: #F4F4F4 solid 1upx;
		
	}
	
	.rounded-circle{
		border-radius: 15%;
		margin-right: 10upx;
		border: #171606 solid 1upx;
	}
	
	.list1{
		flex-grow: 1;
		border-radius: 35%;
	}
	.list2{
		display: flex;
		justify-content: space-between;
		border-radius: 15%;
	}
	
	.list3{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.text-m{
		font-size: 30upx;
	}
	.text-secondary{
		color: #797b80;
		font-size: 25upx;
	}
</style>
