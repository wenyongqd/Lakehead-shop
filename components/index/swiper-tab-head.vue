<template>
	<view class="tabs">
		<scroll-view scroll-x class="scroll-h">
			<block v-for="(tab,index) in tabBars" :key="tab.id">
				<view class="swiper-tab-list" 
				:class="{'active':tabIndex==index}"
				@tap="tabtap(index)">
					{{tab.name}}
					<view class="swiper-tab-line"></view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			tabBars:Array,
			tabIndex:Number
		},
		methods: {
			// tabbar点击事件
			tabtap(index){
				this.$emit('tabtap', index);
			}
		}
	}
</script>

<style>
	.scroll-h{
		border-bottom: 1upx solid #EEEEEE;
	}
	.swiper-tab-list{
		color: #969696;
		font-weight: bold;
	}
	.tabs .active{
		color: #343434;
	}
	.active .swiper-tab-line{
		border-bottom: 6ups solid #FEDE33;
		width: 70upx;
		margin: auto;
		border-top: 10upx solid #FEDE33;
		border-radius: 20upx;
	}
</style>
