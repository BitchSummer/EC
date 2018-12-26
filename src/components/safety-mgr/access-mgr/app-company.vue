<template>
	<div>
		<toolbar>
			<span slot="right">
				<el-button size="small" style="width: 100px;" type="primary" @click="doAdds">批量添加</el-button>
				<el-button size="small" style="width: 100px;" plain @click="enable" :disabled="selRow==null">批量移除</el-button>
			</span>
		</toolbar>

		<el-card style="clear:both;">
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @row-dblclick="doView">
				<el-table-column type="selection" width="35" />
				<el-table-column resizable show-overflow-tooltip property="isPublish" align="center" label="设备分组" width="130" />
				<el-table-column resizable show-overflow-tooltip property="publishTime" align="center" label="部门路径" width="130" />
				<el-table-column resizable show-overflow-tooltip property="industry" align="center" label="使用人" width="130" />
				<el-table-column resizable show-overflow-tooltip property="apiClass" align="center" label="设备分类" width="130" />
				<el-table-column resizable show-overflow-tooltip property="apiName" align="center" label="是否移动设备" width="130" />
				<el-table-column resizable show-overflow-tooltip property="apiDesc" align="center" label="MAC地址"  width="120"/>
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="备注" width="130" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="启停标识" width="130" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="启停时间" width="130" />
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</el-card>
        <!-- 新增设备 -->
		<form-win :config="formConfig" ref="formConfig"/> 
	</div>
</template>
<script>
// 	import {
// 		appPage,
// 		deleteApp
//     } from '../../../api/mac-mgr.js'
    import FormWin from '../mac-mgr/form-win.vue' //新增设备
	export default {
		props: ['config'],
		data() {
			return {
                selRow:null,
				queryParam: {},
				tableData: [],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				appClassMap: null,
				formConfig: { //新增设备弹窗
					title: "新增设备", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "500px", //弹窗宽
					form:{
					},
					btnData: [{
							isShow: true,
							name: "取消",
							bgColor: "info",
							method: "cancel"
						},{
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}
					]
				},
			}
		},
		methods: {
            enable(){ //批量移除

            },
            doAdds(){
                this.formConfig.form ={
					industry:[]
				};
                this.formConfig.dialogVisible=true;
            },
			doAdd() {
				this.appConfig.menuList = [];
				this.appConfig.form = {
					industry: [],
					isNeedStorage: '否',
					isNeedMsg: '否'

				};
				this.appConfig.dialogVisible = true;
			},
			doEdit(row) {
				this.appConfig.form = { ...row
				};
				this.appConfig.form.industry = this.appConfig.form.industry.split(',')
				this.appConfig.dialogVisible = true;
			},
			doView(row) {
				this.viewConfig.form = { ...row
				};
				this.viewConfig.form.industry = this.viewConfig.form.industry.split(',')
				this.viewConfig.dialogVisible = true;
			},
			doDel(id) {
// 				this.$confirm("您确认删除应用APP？", "系统提示", {
// 						confirmButtonText: "确定",
// 						cancelButtonText: "取消",
// 						type: "warning"
// 					})
// 					.then(() => {
// 						deleteApp({
// 							Vue: this,
// 							params: {
// 								id: id
// 							}
// 						}).then(res => {
// 							if (res.result)
// 								this.doSearch()
// 						})
// 					})
			},
			doMenuMaintain(appId) {
				this.menuConfig.appId = appId;
				this.menuConfig.dialogVisible = true;
			},
			doSearch(page) {

				let param = { ...this.queryParam
				}
				param.industry = this.config.length == 1 ? this.config[0] : '';
				param.appClass = this.config.length == 2 ? this.config[1] : '';
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
// 				appPage({
// 					Vue: this,
// 					params: param
// 				}).then(res => {
// 					if (res.result) {
// 						this.tableData = res.model.items;
// 						this.page.total = res.model.numRows;
// 
// 					}
// 				})

			}
		},
		components: {
		     FormWin
		}
	}
</script>
<style lang="less">

</style>