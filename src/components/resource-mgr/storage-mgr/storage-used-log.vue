<template>
<div>
	<toolbar>
				<span slot="left">
					<el-input size="small" style="width: 150px;" v-model="queryParam.providerName" placeholder="应用分类搜索..."></el-input>
					<el-input size="small" style="width: 150px;" v-model="queryParam.appName" placeholder="应用名称搜索..."></el-input>
					<el-input size="small" style="width: 150px;" v-model="queryParam.isNeedStorage" placeholder="操作类别搜索..."></el-input>
					<el-input size="small" style="width: 150px;" v-model="queryParam.isNeedMsg" placeholder="操作人搜索..."></el-input>
					<el-button icon="el-icon-search" size="small" style="width: 100px;" type="primary" @click="doSearch">查询</el-button>
					<el-button icon="el-icon-close" size="small" style="width: 100px;" @click="queryParam={}">清空条件</el-button>
				</span>
			</toolbar>
	
				<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" >
					<el-table-column type="index" width="55" align="center"/>
					<el-table-column resizable show-overflow-tooltip property="createTime" align="center" label="操作时间" width="200" />
					<el-table-column resizable show-overflow-tooltip property="createBy" align="center" label="操作人" width="120" />
					<el-table-column resizable show-overflow-tooltip property="opType" align="center" label="操作类别" width="120" />
					<el-table-column resizable show-overflow-tooltip property="appClass" align="center" label="应用分类" width="120" />
					<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="应用名称" />
					<el-table-column resizable show-overflow-tooltip property="resourceName" align="center" label="资源名称"  />
					<el-table-column resizable show-overflow-tooltip property="resourceSize" align="center" label="资源大小(MB)" width="120" />
					
				</el-table>
				<div class="my-pagination">
					<page-tool @doSearch="doSearch" :pageParam="page" ></page-tool>
				</div>
	</div>
</template>
<script>
	import {
		logPage
	} from '../../../api/resource-storagemgr.js'
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
			}
		},
		methods: {
			doSearch(page) {
				let queryParam = { ...this.queryParam
				};
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				if(this.currOrg!=null)
					queryParam.orgId = this.currOrg.id;
				queryParam.pageNo = this.page.pageNo;
				queryParam.pageSize = this.page.pageSize;
				logPage({
					Vue: this,
					params: queryParam
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;
					}
				})
			}
		}
	}
</script>
<style lang="less">

</style>
