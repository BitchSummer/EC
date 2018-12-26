<template>
	<el-card>
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" >
				<el-table-column type="index" width="55" />
				<el-table-column resizable show-overflow-tooltip property="providerName" align="center" label="服务商" />
				<el-table-column resizable show-overflow-tooltip property="appName" align="center" label="云应用" />
				<el-table-column resizable show-overflow-tooltip property="isValid" align="center" label="有效标识" width="120px"/>
				<el-table-column resizable show-overflow-tooltip property="invalidDate" align="center" label="截止有效期" width="200px"/>
				<el-table-column resizable show-overflow-tooltip property="distributeCapacity" align="center" label="分配容量(GB)"  width="200px" >
						<template slot-scope="scope">
							<el-input-number size="small" :controls="false" v-model="scope.row.capacity" :precision="0" :min="0" :max="10000000"></el-input-number>
						</template>
					</el-table-column>
				<el-table-column resizable show-overflow-tooltip align="center" label="剩余容量(GB)"  width="200px">
					<template slot-scope="scope">
						{{scope.row.capacity-scope.row.balanceCapacity}}
					</template>
				</el-table-column>
				<el-table-column resizable show-overflow-tooltip property="balanceCapacity" align="center" label="使用容量(GB)"  width="200px"/>
				<el-table-column resizable show-overflow-tooltip align="center" label="操作"  width="100px">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="doSave(scope.row)">保存</el-button>
					</template>
				</el-table-column>
			</el-table>
	</el-card>
</template>
<script>
	import {
		distributeList,
		saveDistribute
	} from '../../../api/resource-storagemgr.js'
	export default {
		data() {
			return {
				tableData: []
			}
		},
		methods: {
			doSearch() {
				distributeList({
					Vue: this
				}).then(res => {
					if (res.result) {
						this.tableData = res.model;
					}
				})
			},
			doSave(row){
				delete row.createTime
				delete row.invalidDate
				delete row.modifyTime
				saveDistribute({
					Vue: this,
					params:row
				}).then(res => {
					if (res.result) {
						this.$message({
						  message: '保存成功...',
						  type: 'success'
						});
					}
				})
			}
		}
	}
</script>
<style lang="less">

</style>
