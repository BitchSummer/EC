<!--
  规格配置
 -->

<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" v-if="config.dialogVisible">
		<el-card>
			<app-form :form="appForm" />
		</el-card>

		<el-row :gutter="10" style="margin-top: 10px;">
			<el-col :span="9">
				<el-card>
					<menu-tree :menuMap="menuMap"  @nodeChange="loadMenuInfo" />
				</el-card>
			</el-col>

			<el-col :span="15">
				<el-card>
					<menu-form :form="menuForm"  />
				</el-card>
			</el-col>
		</el-row>
	</toast>

</template>

<script>
	import AppForm from './app-form.vue'
	import MenuTree from './menu-tree.vue'
	import MenuForm from './menu-form.vue'

	import {
		appMenuList,
		appMenuBtnList
	} from '../../../api/resource-appmgr.js'
	export default {
		data() {
			return {
				menuMap: new Map(),
				menuForm: {},
				appForm:{},
				config: {
					title: "APP应用信息-查看", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "1000px", //弹窗宽
					form: {},
					btnData: [{
						isShow: true,
						name: "关闭",
						bgColor: "dialog-normal",
						method: "cancel"
					}]
				}
			}
		},
		methods: {
			show(appForm,menuMap){
				this.appForm = appForm;
				this.menuMap =menuMap;
				this.config.dialogVisible = true;
			},
			
			loadMenuInfo(node) {
				let menu = node.data;
				if (menu.isBtnCtr == '操作控制') {
					appMenuBtnList({
						Vue: this,
						params: {
							menuId: menu.id
						}
					}).then(res => {
						if (res.result) {
							menu.btnArr = res.model;
							this.menuForm = menu;
						}
					});
				} else {
					menu.btnArr = []
					this.menuForm = menu;
				}
				
			}
		},
		components: {
			AppForm,
			MenuTree,
			MenuForm
		}
	}
</script>
<style lang="less">
	.view-form {
		margin: auto 20px;

		h1 {
			font-size: 15px;
			margin: 15px auto;
		}

		.el-form-item {
			margin-bottom: 5px;
		}
	}
</style>
