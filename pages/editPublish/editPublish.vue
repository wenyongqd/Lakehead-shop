<template>
	<view>
		<view>这里放个人头像</view>
		<view>
			<scroll-view scroll-y class="list" :style="{height:swiperheight+'px'}">
				<template v-if="items.length>0">
					<!-- 图文列表 -->
					<block v-for="(item, index) in items" :key="index1">
					<personal-item :item="item" :index="index"></personal-item>
					</block>
				</template>
			</scroll-view>
		</view>
	</view>
	
</template>

<script>
	import personalItem from "../../components/personalitem/personalitem.vue"
	export default {
		components:{
			personalItem,
		},
		data() {
			return {
				items:[]
			}
		},
		onLoad(){
			this.getList()
		},
		onShow(){
			this.getList()
		},
		methods: {
			//分页获取个人商品列表
			getList(){
				let auth = "Bearer " + uni.getStorageSync("jwt")
				let myoptions = {
					header:{
						"content-type":"application/x-www-form-urlencoded",
						"Authorization": auth
					}
				};
				this.$H.get('/item/listOwnSale/1/6', {}, myoptions).then(res2 => {
					let [err2, result2] = res2
					console.log()
					let list = result2.data.data.map(v=>{
						return {
							userpic:v.avatar,
							username:v.nickName,
							productId:v.productId,
							title:v.productName,
							description:v.productDesc,
							price:v.productPrice,
							status:v.enableStatus,
							titlepic:v.imgAddrArray[0],
							images:v.imgAddrArray,
							createdTime:v.createTime,
						}
					})
					this.items = list
				});
			}
		}
	}
</script>

<style>

</style>
