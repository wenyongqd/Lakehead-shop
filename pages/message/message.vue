<template>
	<view>
		<template v-if="list.length > 0">
		<block v-for="(item,index) in list" :key="index">
			<msg-list :item="item" :index="index"></msg-list>
		</block>
		</template>
		<template v-else>
			<no-thing></no-thing>
		</template>
		<!-- 弹出层 -->
		<uni-popup ref="popup" type="top">
			<view class="flex align-center justify-center font-md border-bottom py-2" 
			hover-class="bg-light" @click="popupEvent('friend')">
				<text class="icon iconfont icon-sousuo mr-2"> </text>Add friend
			</view>
			<view class="flex align-center justify-center font-md py-2" 
			hover-class="bg-light" @click="popupEvent('clear')">
				<text class="icon iconfont icon-shanchu mr-2"> </text>Clear cache
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import msgList from '@/components/msg/msg-list.vue'
	import noThing from '@/components/common/no-thing.vue'
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue'
	const demo = [{
					avatar:"../../static/touxiang1.png",
					username:"Wenyong",
					updatedAt:"1595135338",
					data:"When outlining a motion, I ask two important questions: what do I want to prove, and what do I want the judge to do? If you can answer those questions clearly, you’re half-way home already.",
					unreadNo:20
				},{
					avatar:"../../static/touxiang1.png",
					username:"Wenyong",
					updatedAt:"1595135338",
					data:"When outlining a motion, I ask two important questions: what do I want to prove, and what do I want the judge to do? If you can answer those questions clearly, you’re half-way home already.",
					unreadNo:20
				},{
					avatar:"../../static/touxiang1.png",
					username:"Wenyong",
					updatedAt:"1595135338",
					data:"When outlining a motion, I ask two important questions: what do I want to prove, and what do I want the judge to do? If you can answer those questions clearly, you’re half-way home already.",
					unreadNo:20
				},{
					avatar:"../../static/touxiang1.png",
					username:"Wenyong",
					updatedAt:"1595135338",
					data:"When outlining a motion, I ask two important questions: what do I want to prove, and what do I want the judge to do? If you can answer those questions clearly, you’re half-way home already.",
					unreadNo:20
				}];
	export default {
		components: {
			msgList,
			noThing,
			uniPopup
		},
		data() {
			return {
				list:[]
			}
		},
		//页面加载
		onLoad() {
			this.list = demo
		},
		//监听原生导航栏按钮事件
		onNavigationBarButtonTap(e){
			switch (e.index){
				case 0:  //左边
				this.$refs.popup.close();
					break;
				case 1:  //右边
				this.$refs.popup.open();
					break;
			}
		},
		//监听下拉刷新
		onPullDownRefresh(){
			this.refresh()
		},
		methods:{
			refresh(){
				setTimeout(()=>{
					this.list = demo;
					//停止下拉刷新
					uni.stopPullDownRefresh()
				},2000)
			},
			//弹出层选项点击事件
			popupEvent(e){
				switch (e){
					case 'friend':
					console.log('添加好友')
						break;
					case 'clear':
					console.log('清除列表')
						break;
				}
				//关闭弹出层
				this.$refs.popup.close()
			}
			
		}
	}
</script>


<style>
	
</style>
