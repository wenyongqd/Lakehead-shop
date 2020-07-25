<template>
	<view>
		<template v-if="list.length>0">
			<block v-for="(item, index) in list" :key="index">
				<index-list :item="item" :index="index"></index-list>
			</block>
			<load-more :loadtext="loadtext"></load-more>
		</template>
		<template v-else>
			<no-thing></no-thing>
		</template>
	</view>
</template>

<script>
	import indexList from "../../components/index/index-list.vue"
	import noThing from "../../components/common/no-thing.vue"
	import loadMore from "../../components/common/load-more.vue"
	import qs from 'qs';
	export default {
		components:{
			indexList,
			noThing,
			loadMore
		},
		data() {
			return {
				searchText:"",
				list:[],
				// 搜索结果
				searchList:[],
				// 当前搜索类型
				type:"post",
				loadmore:"上拉加载更多",
				page:0,
				pageSize:5,

				keywords:"相机"


			}
		},
		
		//监听原声标题导航按钮点击事件
		onNavigationBarButtonTap(e){
			if(e.index == 0){
				uni.navigateBack({
					delta: 1
				});
			}
		},
		//监听搜索框文本变化
		onNavigationBarSearchInputChanged(e){
			this.searchText = e.text
		},
		// 监听点击导航搜索按钮
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				debugger
				this.searchEvent()
			}
		},
		//监听点击搜索按钮事件
		onNavigationBarSearchInputConfirmed(e){
			this.searchEvent(e.text)
		},
		// 监听页面处理事件
		onReachBottom() {
			this.loadmore();
		},
		methods:{
			// 上拉加载
			// loadmore(){
			// 	if(this.loadtext!="上拉加载更多"){ return; }
			// 	// 修改状态
			// 	this.loadtext="加载中...";
			// 	setTimeout(()=>{
			// 		let obj={
			// 			userpic:"../../static/demo/userpic/wenyong.png",
			// 			username:"昵称",
			// 			isguanzhu:false,
			// 			title:"我是标题",
			// 			type:"img",
			// 			titlepic:"../../static/demo/datapic/img.png",
			// 			infonum: {
			// 				index:1, //0:没有操作;1:顶;2:踩
			// 				zan:11,
			// 				cai:1,
			// 			},
			// 			createdTime:"10 分钟前",
			// 			commentNum:10,
			// 			sharenum:10
			// 		};
			// 		this.list.push(obj);
			// 		this.loadtext="上拉加载更多";
			// 	}, 1000);
			// 	// this.newslist[this.tabIndex].page++;
			// 	// this.getList();
			// },
			getData(isrefresh = true,callback = false){
				// uni.showLoading({
				// 	title: '加载中...',
				// 	mask: false
				// })
				// 请求搜索
				// this.page = isrefresh ? 1 : (this.page + 1)
				this.$H.post('/item/list'
				,{
					keywords:this.searchText,
					page:this.page,
					pageSize:this.pageSize		
				}
				).then(res=>{
					// 整理格式
					let [err, result] = res
					
					// console.log(result.data)
					let list = []
			
					list = result.data.data.map(v=>{
						// return this.$U.formatCommonList(v)
						return {
							userpic:v.avatar,
							username:v.nickName,
							isguanzhu:false,
							title:v.productDesc,
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
					console.log(list[0])
					console.log(list[1])
					this.list = list
					console.log(this.list.length)
					
			
			// 		// 渲染页面
			// 		this.searchList = isrefresh ? [...list] : [...this.searchList,...list]
			// 		// 加载情况
			// 		this.loadmore = list.length < 10 ? '没有更多了' : '上拉加载更多'
					//隐藏loading
					// uni.hideLoading()
					// if(typeof callback === 'function'){
					// 	callback()
					// }
				}).catch(err=>{
					this.page--
					//隐藏loading
					uni.hideLoading()
					if(typeof callback === 'function'){
						callback()
					}
				})
			},
			// 搜索事件
			searchEvent(){
				// 收起键盘
				uni.hideKeyboard()
				
				// 请求搜索
				this.getData()
			},
	}
}
</script>

<style>

</style>
