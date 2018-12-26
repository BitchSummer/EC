<template>
	<el-card>
	
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" >
				<el-table-column type="index" width="55" />
				<el-table-column resizable show-overflow-tooltip property="providerName" align="center" label="服务商" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="云应用" />
				<el-table-column resizable show-overflow-tooltip property="isValid" align="center" label="有效标识" width="120px"/>
				<el-table-column resizable show-overflow-tooltip property="invalidDate" align="center" label="截止有效期" width="200px"/>
				<el-table-column resizable show-overflow-tooltip property="msgUsedCount" align="center" label="短信使用(条)"  width="200px" />
			</el-table>
	</el-card>
</template>
<script>
	import {
		appUsedList
	} from '../../../api/resource-msgmgr.js'
	export default {
		data() {
			return {
				tableData: []
			}
		},
		methods: {
			doSearch() {
				appUsedList({
					Vue: this
				}).then(res => {
					if (res.result) {
						this.tableData = res.model;
					}
				})
			}
		}
	}
</script>
<style lang="less">

</style>
