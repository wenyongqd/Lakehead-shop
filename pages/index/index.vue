<template>
	<view>
		<view class="header">
			<block class="iner-header">
				<image class="image-size" src="../../static/lakeheadLogo.png" mode="aspectFit" lazy-load=""></image>
			</block>
		</view>
		<swiper-tab-head 
		:tabBars="tabBars" 
		:tabIndex="tabIndex"
		@tabtap="tabtap"
		></swiper-tab-head>
		
		<view class="tabs">
		<swiper class="swiper-box" 
		:style="{height:swiperheight+'px'}" 
		:current="tabIndex"
		@change="tabChange">
			<swiper-item v-for="(items, index) in newslist" :key="index" :style="{height:swiperheight+'px'}" >
				<scroll-view scroll-y class="list" :style="{height:swiperheight+'px'}" @scrolltolower="loadmore(index)">
					<template v-if="items.list.length>0">
						<!-- 图文列表 -->
						<block v-for="(item, index1) in items.list" 
						:key="index1">
						<index-list :item="item" :index="index"></index-list>
						</block>
						<!-- 上拉加载 -->
						<load-more :loadtext="items.loadtext"></load-more>
					</template>
					<template v-else>
						<no-thing></no-thing>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
		</view>
		
	</view>
	

	
</template>

<script>
	import swiperTabHead from "../../components/index/swiper-tab-head.vue"
	import indexList from "../../components/index/index-list.vue"
	import loadMore from "../../components/common/load-more.vue"
	import noThing from "../../components/common/no-thing.vue"

	export default {
		components:{
			indexList,
			swiperTabHead,
			loadMore,
			noThing
		},
		data() {
			return {
				swiperheight:600,
				tabIndex:0,
				tabBars:[
					{ name:"Hot",id:"hot" },
					{ name:"Recent",id:"recent" },
					{ name:"For you",id:"list" },
					
				],
				newslist:[
					// 	loadtext:"上拉加载更多",
					// 	list:[
					// 		{
					// 			userpic:"../../static/demo/userpic/wenyong.png",
					// 			username:"Wenyong",
					// 			isguanzhu:false,
					// 			title:"This is a title",
					// 			type:"img",
					// 			titlepic:"../../static/demo/datapic/travel.png",
					// 			infonum: {
					// 				index:1, //0:没有操作;1:顶;2:踩
					// 				zan:11,
					// 				cai:1,
					// 			},
					// 			description:"正品Gucci Jackie mini收藏版包包,蒂芙尼婴儿蓝金丝蓝偏光暗纹老花纹配金  巨美 美翻 五金一点点保存痕迹!没有使用过!中古保存品配件尘袋 百分百正品 真正爱的再来问!!",
					// 			createdTime:"10 minutes ago",
					// 			commentNum:10,
					// 			sharenum:10
					// 		}
					// 	]
					// },
				]

			}
		},
		onLoad() {
			uni.getSystemInfo({
			    success: (res) => {
					this.swiperheight = res.windowHeight - uni.upx2px(101)
			    }
			});
			this.getData()
		},
		//监听搜索框点击事件
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url: '../search/search',

			});
		},
		methods: {
			getData(){
				let index = this.tabIndex;
				let id = this.tabBars[index].id;
				// 获取分类
				this.$H.get('/item/'+id+'0/6').then(res => {
					
					let [err, result] = res

					// this.tabBars = result.data.data.list
					//根据分类列表生成数据

					var arr = []
					for (let i = 0; i < this.tabBars.length; i++) {
						//生成列表模板
						arr.push({
							// 1 上拉加载更多 2 加载中 3 没有更多了
							loadmore: "上拉加载更多",
							list:[],
							page:1
						})
					}
					this.newslist = arr
					// 获取第一个分类的数据
					if (this.tabBars.length) {
						this.getList()
					}
					console.log(this.newslist[0])
					
				})
			},
			selectedNote (item) {
			    this.$store.dispatch('getNote',item);
			    this.$router.push('/note');
			},
			// 上拉加载
			loadmore(index){
				// 拿到当前列表
				let item = this.newlist[index]
				// 判断是否处于可加载状态
				if (item.loadmore !== '上拉加载更多') return
				// 修改当前列表加载状态
				item.loadmore = '加载中...'
				//请求数据
				item.page++
				
				// if(this.newslist[index].loadtext!="上拉加载更多"){ return; }
				// // 修改状态
				// this.newslist[index].loadtext="加载中...";
				// setTimeout(()=>{
				// 	let obj={
				// 		userpic:"../../static/demo/userpic/wenyong.png",
				// 		username:"昵称",
				// 		isguanzhu:false,
				// 		title:"我是标题",
				// 		type:"img",
				// 		titlepic:"../../static/demo/datapic/img.png",
				// 		infonum: {
				// 			index:1, //0:没有操作;1:顶;2:踩
				// 			zan:11,
				// 			cai:1,
				// 		},
				// 		createdTime:"10 分钟前",
				// 		commentNum:10,
				// 		sharenum:10
				// 	};
				// 	this.newslist[index].list.push(obj);
				// 	this.newslist[index].loadtext="上拉加载更多";
				// }, 1000);
				// // this.newslist[this.tabIndex].page++;
				// // this.getList();
			},
			tabtap(index){
				this.tabIndex=index;
				//获取当前分类下的列表数据
				this.getList()
			},
			//获取指定分类下的列表
			getList(){
				let index = this.tabIndex
				let id = this.tabBars[index].id
				let page = this.newslist[index].page

				// this.$H.get('/item/'+id+'0/6')
				this.$H.get('/item/'+id+'/0/6').then(res2 => {
					let [err2, result2] = res2

					let list = result2.data.data.map(v=>{
						return {
							userpic:v.avatar,
							username:v.nickName,
							isguanzhu:false,
							title:v.productName,
							type:"img",
							titlepic:v.imgAddrArray[0],
							images:v.imgAddrArray,
							infonum: {
								index:1, //0:没有操作;1:顶;2:踩
								zan:11,
								cai:1,
							},
							description:v.productDesc,
							createdTime:v.createTime,
							commentNum:10,
							sharenum:10
						}
					})
					this.newslist[index].list = list
				})
			},
			//滑动事件
			tabChange(e){
				this.tabIndex=e.detail.current;
			}
		},
		
	}
</script>

<style>
	.header{
		background-color: #39b1ff;
		
	}
	.image-size{
		height: 60upx;
	    margin-top: 13upx;
		margin-left: 58upx;
	}
</style>
