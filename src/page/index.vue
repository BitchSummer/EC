<template>
	<div class="app-view">
		<div v-show="loadingTag>0" class="qwLoadingMask">
			<div class="loader-inner line-scale-pulse-out-rapid">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
		<!-- header -->
		<qwHead></qwHead>
		<div class="content">
			<div class="left" :style="{width:sideBarWidth+'px',height: sideBarHeight+'px',left: (isShowSidebar==true? 0 : -1* sideBarWidth +'px') }">
				<sideMenu></sideMenu>
			</div>
			<div class="main" :style="{height: sideBarHeight+'px',paddingLeft: (isShowSidebar? parseInt(sideBarWidth)+'px': '0')}">
				<tags @activeIndexChanged="tagsActiveIndexChanged" />
				<transition name="fade-transverse">
					<router-view :style="{height: (sideBarHeight-48) + 'px',background:'rgba(240,242,245,1)',overflowY:'scroll',boxSizing:'border-box',padding:'24px 24px 0'}"></router-view>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		mapMutations,
		mapGetters,
		mapState
	} from 'vuex';
	import qwHead from '../components/main/head.vue'
	import tags from '../components/main/tags.vue'
	import sideMenu from '../components/main/sideMenu.vue'
	let that = null;
	var vueObj = {
		name: 'app',
		components: {
			qwHead,
			tags,
			sideMenu
		},
		data() {
			return {
				transitionName: 'slide-left',
				sideBarHeight: 500,
				sideBarWidth: 260,
				msg: 'Welcome to Your Vue.js App'
			}
		},
		props: ["appUrl", "appName", "userName", "userImg", "companyName", "companyEnglish", "companyLogo"],
		computed: {
			...mapState({
				isShowSidebar: state => state.app.isShowSidebar,
				loadingTag: state => state.app.loadingTag
			})
			//...mapGetters(['getIsLoading','getShowSidebar'])
		},
		watch: {
			'$route'(to, from) {
				let box = that.$refs['mainBox'];
				if (box) {
					box.setAttribute('class', 'mainBox ani0');
					setTimeout(() => {
						box.setAttribute('class', 'mainBox');
					}, 300)
				}
			}
		},
		mounted() {
			window.localStorage.setItem('ports', this.appUrl);
			var mainNav = [{
					id: 1,
					title: '部门人员',
					childrens: [

						{
							id: 10,
							title: '部门管理',
							link: '/orguser-mgr/org-mgr'
						},
						{
							id: 11,
							title: '人员管理',
							link: '/orguser-mgr/user-mgr'
						}
					]
				},
				{
					id: 2,
					title: '资源管理',
					link: '',
					childrens: [
						{
							id: 20,
							title: '应用管理',
							link: '/resource-mgr/app-mgr'
						},
						{
							id: 21,
							title: '云存储管理',
							link: '/resource-mgr/storage-mgr'
						},
						{
							id: 22,
							title: '短信管理',
							link: '/resource-mgr/msg-mgr'
						}
					]
				},
				{
					id: 3,
					title: '授权管理',
					link: '/dataCenter',
					childrens: [{
							id: 31,
							title: '角色管理',
							link: '/grant-mgr/role-mgr'
						},
						{
							id: 32,
							title: '应用授权',
							link: '/grant-mgr/app-grant'
						},
						{
							id: 33,
							title: '人员授权',
							link: '/grant-mgr/user-grant'
						}
					]
				},
				{
					id: 4,
					title: "信息管理",
					link: "",
					childrens: [{
							id: 41,
							title: '消息管理',
							link: '/trade-mgr/order-mgr'
						},
						{
							id: 42,
							title: '任务管理',
							link: '/trade-mgr/receivable-mgr'
						},
						{
							id: 43,
							title: '日程安排',
							link: '/trade-mgr/deliver-mgr'
						},
						{
							id: 44,
							title: '企业文库',
							link: '/trade-mgr/invoice-mgr'
						},
						{
							id: 45,
							title: '企业知识库',
							link: '/trade-mgr/balance-mgr'
						}
					]
				},
				{
					id: 5,
					title: "模板管理",
					link: "",
					childrens: [{
							id: 51,
							title: '短信模板',
							link: '/template-mgr/msg-template'
						},
						{
							id: 52,
							title: '打印模板',
							link: '/template-mgr/print-template'
						},
						{
							id: 53,
							title: '编码规则',
							link: '/template-mgr/code-rule'
						}
					]
				},
				{
					id: 6,
					title: "安全管理",
					link: "",
					childrens: [{
							id: 61,
							title: 'MAC管理',
							link: '/safety-mgr/mac-mgr'
						},
						{
							id: 62,
							title: '访问控制',
							link: '/safety-mgr/access-mgr'
						}
					]
				}
			]
			this.SET_SIDE_MENUS(mainNav)
			this.getFirst(mainNav[0]);
			this.init();
			this.setSize();
			window.onresize = () => {
				this.setSize();
			}
		},
		created() {
			that = this;
		},
		methods: {
			...mapMutations(["ADD_TAG", "SET_APP_NAME", "SET_USER_IMG", "SET_USER_NAME", 'SET_COMPANY_NAME',
				'SET_COMPANY_ENGLISH', 'setCompanyLogo', 'setPorts', 'SET_IFRAMELINK', 'SET_SIDEBARHIEGHT', 'SET_SIDE_MENUS'
			]),
			init() {
				this.SET_COMPANY_NAME(this.companyName);
				this.SET_APP_NAME(this.appName);
				this.SET_COMPANY_ENGLISH(this.companyEnglish);
				this.SET_USER_NAME(this.userName);
				this.SET_USER_IMG(this.userImg);

				console.log("companyName", this.setCompanyName);
			},
			tagsActiveIndexChanged(tag) {
				if (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(tag.link)) {
					this.SET_IFRAMELINK(tag.link);
					this.$router.push({
						path: '/iframeLink',
						params: {
							urlLink: tag.link
						}
					})
				} else {
					this.$router.push({
						path: tag.link
					});
				}
			},
			//递归找到首先应该触发的页面
			getFirst(menu) {
				if (!menu) return;
				if (!menu.childrens || (menu.childrens.length < 1)) {
					setTimeout(() => {
						this.ADD_TAG(menu);
						this.tagsActiveIndexChanged(menu);
					}, 50);
				} else {
					this.getFirst(menu.childrens[0])
				}
			},
			setSize() {
				this.sideBarHeight = this.getClientHeight() - 85;
				this.SET_SIDEBARHIEGHT(this.sideBarHeight);
			},
			getClientHeight() {
				var clientHeight = 0;
				if (document.body.clientHeight && document.documentElement.clientHeight) {
					var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight :
						document.documentElement.clientHeight;
				} else {
					var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight :
						document.documentElement.clientHeight;
				}
				return clientHeight;
			}
		}
	}
	export default vueObj;
</script>
<style lang="less">
	//基础样式
	@import "../assets/style/reset.less";

	.app-view {
		width: 100%;
		height: auto;
		min-height: 600px;
		box-sizing: border-box;

		.content {
			position: relative;

			.left {
				width: 260px;
				min-height: 500px;
				background: #00142a;
				border-right: 1px solid #EEE;
				position: absolute;
				left: 0;
				top: 0px;
				transition: all 0.2s;
			}

			.main {
				transition: all 0.2s;
				width: 100%;
				padding-right: 0;
				background: #FFF;
				box-sizing: border-box;
				overfolow: hidden;
			}

			.fade-transverse-leave-active,
			.fade-transverse-enter-active {
				transition: all .5s;
			}

			.fade-transverse-enter {
				opacity: 0;
				transform: translateX(-30px);
			}

			.fade-transverse-leave-to {
				opacity: 0;
				transform: translateX(30px);
			}
		}

		.qwLoadingMask {
			width: 100%;
			height: 100vh;
			background: rgba(0, 0, 0, 0.1);
			position: absolute;
			left: 0;
			top: 0;
			z-index: 100000;

			.line-scale-pulse-out-rapid {
				width: 60px;
				margin: 0 auto;
				margin-top: 35vh;
			}

			.line-scale-pulse-out-rapid>div:nth-child(1),
			.line-scale-pulse-out-rapid>div:nth-child(5) {
				-webkit-animation-delay: 0.5s !important;
				animation-delay: 0.5s !important;
			}

			.line-scale-pulse-out-rapid>div:nth-child(2),
			.line-scale-pulse-out-rapid>div:nth-child(4) {
				-webkit-animation-delay: 0.25s !important;
				animation-delay: 0.25s !important;
			}

			.line-scale-pulse-out-rapid>div {
				background-color: #409EFF;
				width: 4px;
				height: 35px;
				border-radius: 2px;
				margin: 2px;
				-webkit-animation-fill-mode: both;
				animation-fill-mode: both;
				display: inline-block;
				-webkit-animation: line-scale-pulse-out-rapid 0.9s 0s infinite cubic-bezier(.11, .49, .38, .78);
				animation: line-scale-pulse-out-rapid 0.9s 0s infinite cubic-bezier(.11, .49, .38, .78);
			}

		}
	}

	@keyframes line-scale-pulse-out-rapid {
		0% {
			-webkit-transform: scaley(1);
			transform: scaley(1);
		}

		80% {
			-webkit-transform: scaley(0.3);
			transform: scaley(0.3);
		}

		90% {
			-webkit-transform: scaley(1);
			transform: scaley(1);
		}
	}
</style>
