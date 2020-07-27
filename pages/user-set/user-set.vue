<template>
	<view class="container">
		<view class="content">
			<view class="title">My account</view>
			<view>
				<view class="icon iconfont icon-jinru"></view>
			</view>
			
		</view>
		
		<view class="content">
			<view class="title">My profile</view>
			<view>
				<view class="icon iconfont icon-jinru"></view>
			</view>
			
		</view>
		
		<view class="py-2 px-3" style="margin-top: 20px;">
			<button class="bg-main text-white" style="border-radius: 50rpx;border: 0;" type="primary" @click="logout">Log out</button>
		</view>
	</view>
	
	
</template>

<script>
</script>

<style>
	.container{
		padding: 10px;
	}
	.content {
		padding: 5px;
		display: flex;
		justify-content: space-between;
		color: #3b4144
	}
	.title {
		font-size: 34upx;
	}
</style>
