<template>
	<div>
		<el-card>
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		</el-card>
		<toolbar>
			<span slot="left">
				<el-input size="small" style="width: 150px;" v-model="queryParam.providerName" placeholder="服务商搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.appName" placeholder="应用名称搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.isNeedStorage" placeholder="支持云存储搜索..."></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.isNeedMsg" placeholder="支持短信搜索..."></el-input>
				<el-button icon="el-icon-search" size="small" style="width: 100px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 100px;" @click="queryParam={}">清空条件</el-button>
			</span>
			<span slot="right">
				<el-button icon="el-icon-setting" size="small"  type="danger" @click="doMgrSet">管理人设置</el-button>
			</span>
		</toolbar>

		<el-card style="clear:both;">
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @row-dblclick="doView">
				<el-table-column type="index" width="55" />
				<el-table-column resizable show-overflow-tooltip property="industry" align="center" label="行业领域" width="120" />
				<el-table-column resizable show-overflow-tooltip property="appClass" align="center" label="应用分类" width="120" />
				<el-table-column resizable show-overflow-tooltip property="providerName" align="center" label="服务商" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="应用名称" width="200" />
				<el-table-column resizable show-overflow-tooltip property="isNeedStorage" align="center" label="支持云存储" width="120" />
				<el-table-column resizable show-overflow-tooltip property="isNeedMsg" align="center" label="支持短信" width="120" />
				<el-table-column resizable show-overflow-tooltip property="invalidDate" align="center" label="截止有效日" width="120" />
				<el-table-column resizable show-overflow-tooltip property="gantUserCount" align="center" label="授权用户数"
				 width="120" />
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</el-card>
		<app-view-win ref="appViewWin"/>
		<mgr-win ref="mgrWin"/>
	</div>

</template>
<script>
	import {
		appBase,
		appPage,
		appMenuList
	} from '../../api/resource-appmgr.js'
	import AppViewWin from '../../components/resource-mgr/app-mgr/app-view-win.vue'
	import MgrWin from '../../components/resource-mgr/app-mgr/mgr-win.vue'
	export default {
		data() {
			return {
				queryParam: {},
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData:[],
				//筛选数据
				classifiedConfig: [{
					title: '行业领域:',
					options: []
				}, {
					title: '应用分类:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}],
				appClassMap: null
			}
		},
		methods: {
			doMgrSet(){
				this.$refs.mgrWin.show();
			},
			doView(row) {
				appMenuList({
					Vue: this,
					params: {
						appId: row.id
					}
				}).then(res => {
					if (res.result) {
						let menuArr = res.model;
						let menuMap = new Map();
						menuArr.forEach(menu => {
							if (menuMap.has(menu.parentId)) {
								menuMap.get(menu.parentId).push(menu)
							} else
								menuMap.set(menu.parentId, [menu])
						});
						this.$refs.appViewWin.show({ ...row
						},menuMap);
					}
				});

			},
			doClickHandler(index, option) {
				if (index == 0) {
					this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length);
					let appClassArr = this.appClassMap.get(option.value);
					if (appClassArr && appClassArr.length > 0) {
						appClassArr.forEach(item => {
							this.classifiedConfig[1].options.push(item);
						});
						this.selectedItems[1].value = this.classifiedConfig[1].options[0].value;
						this.doClickHandler(1, this.classifiedConfig[1].options[0])
					}

				} else {
					this.queryParam.appClass = this.selectedItems[1].value;
					this.queryParam.industry = this.selectedItems[0].value;
					this.doQueryApps();
				}
			},
			doQueryApps(page) {
				let param = { ...this.queryParam
				}
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
				appPage({
					Vue: this,
					params: param
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;

					}
				})
			},
			doSearch() {
				appBase({
					Vue: this,
					params: {}
				}).then(res => {
					if (res.result) {
						let appClassIndustryArr = res.model;
						let industryTempArr = [];
						let appClassTempArr = [];
						this.appClassMap = new Map();

						this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
						if (appClassIndustryArr != null && appClassIndustryArr.length > 0) {
							appClassIndustryArr.forEach(item => {
								if (industryTempArr.indexOf(item.industry) == -1) {
									industryTempArr.push(item.industry)
									this.classifiedConfig[0].options.push({
										label: item.industry,
										value: item.industry
									});
								}
								if (appClassTempArr.indexOf(item.appClass) == -1) {
									if (this.appClassMap.has(item.industry))
										this.appClassMap.get(item.industry).push({
											label: item.appClass,
											value: item.appClass
										});
									else {
										this.appClassMap.set(item.industry, [{
											label: item.appClass,
											value: item.appClass
										}]);
									}
								}
								//默认选中第一个
								this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
								this.doClickHandler(0, this.classifiedConfig[0].options[0])
							})
						}
					}
				})
			}

		},
		mounted() {
			this.doSearch();
		},
		components: {
			AppViewWin,
			MgrWin
		}
	}
</script>
<style lang="less">

</style>
