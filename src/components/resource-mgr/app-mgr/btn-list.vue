<template>
	<el-table height="400" border stripe ref="table" :data="tableData" style="width: 100%">{{tableData}}
		<el-table-column type="index" width="55" align="center" />
		<el-table-column resizable show-overflow-tooltip property="menuNamePath" align="center" label="菜单路径">
			<template slot-scope="scope">
				{{scope.row.menuPath}}
			</template>
		</el-table-column>	
		<el-table-column resizable show-overflow-tooltip align="center" label="操作授权">
			<template slot-scope="scope">
				<!-- {{scope.row.btnList}} -->
				<el-checkbox v-if="scope.row.btnList" v-for="(item,i) in scope.row.btnList" :key="i" v-model="item.check">{{item.btnName}}</el-checkbox>
				<!-- <el-checkbox-group v-model="scope.row.btnArr">
					<el-checkbox v-for="(item,i) in scope.row.btnList" :key="i" :label="item.value">{{item.label}}</el-checkbox>
				</el-checkbox-group> -->
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
	export default {
		props: ['tableData', 'roleRefMenuBtnMap'],
		methods: {
			// dataHander() {
			// 	let data = [];
			// 	this.tableData.forEach(item => {
			// 		item.btnArr = []
			// 		//保存后的数据存储到 item.valueArr里面
			// 		item.valueArr = []; //this.roleRefMenuBtnMap.get(item.menuId)? this.roleRefMenuBtnMap.get(item.menuId) : [];
			// 		if (item.btnIds != null && item.btnIds.length > 0) {
			// 			let btnIdArr = item.btnIds.split(',').map(Number);
			// 			let btnNameArr = item.btnNames.split(',');
			// 			btnIdArr.forEach((btnId, index) => {
			// 				item.btnArr.push({
			// 					value: btnId,
			// 					label: btnNameArr[index]
			// 				})
			// 			})
			// 		}
			// 	})
			// 	return this.tableData;
			// }
		}
	}
</script>

<style>

</style>
