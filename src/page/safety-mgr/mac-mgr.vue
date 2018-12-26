<template>
	<div>
		<el-card>
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		</el-card>
		<toolbar style="margin: 10px auto;">
			<span slot="left">
				<el-input size="small" style="width: 150px;" v-model="queryParam.orgNamePath" placeholder="设备部门搜索"></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.userName" placeholder="设备责任人搜索"></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.devType" placeholder="设备分类搜索"></el-input>
				<el-input size="small" style="width: 150px;" v-model="queryParam.devMac" placeholder="设备MAC搜索"></el-input>
				<el-button icon="el-icon-search" size="small" style="width: 80px;" type="primary" @click="doSearch">查询</el-button>
				<el-button icon="el-icon-close" size="small" style="width: 100px;" @click="queryParam={}">清空条件</el-button>
			</span>
			<span slot="right">
				<el-button size="small" style="width: 100px;" type="danger" @click="doDevGroupMaintain">设备组维护</el-button>
				<el-button size="small" style="width: 100px;" type="primary" @click="doAdd">新增设备</el-button>
				<el-button size="small" style="width: 100px;" plain @click="doDel" :disabled="selRows==null||selRows.length==0">批量删除</el-button>
			</span>
		</toolbar>

		<el-card>
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @selection-change="tableSelectChanged"
			 @row-dblclick="doEdit">
				<el-table-column type="selection" width="35" />
				<el-table-column resizable show-overflow-tooltip property="devGroupNames" align="center" label="设备分组" />
				<el-table-column resizable show-overflow-tooltip property="orgNamePath" align="center" label="部门路径" />
				<el-table-column resizable show-overflow-tooltip property="userName" align="center" label="设备责任人" width="150" />
				<el-table-column resizable show-overflow-tooltip property="devType" align="center" label="设备分类" width="120" />
				<el-table-column resizable show-overflow-tooltip property="devMac" align="center" label="MAC地址" width="300" />
				<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注" />
				<el-table-column label="操作" align="center" width="170">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="doEdit(scope.row)">编辑</el-button>
						<el-button size="mini" type="text" @click="doDel(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</el-card>
		<!-- 设备分组维护 -->
		<dev-group-win ref="devGroupWin" @callback="doQueryDevGroupList"/>
		<!-- 新增设备 -->
		<form-win  ref="formWin" @callback="doSearch" :devGroupArr="devGroupArr"/>
	</div>
</template>
<script>
	import {
		devGroupList,
		saveOrUpdateDevGroup,
		devMacPage,
		deleteDevMac
	} from '../../api/safetymgr-macmgr.js'
	import DevGroupWin from '../../components/safety-mgr/mac-mgr/dev-group-win.vue' //设备分组维护
	import FormWin from '../../components/safety-mgr/mac-mgr/form-win.vue' //新增设备
	export default {
		props: ['config'],
		data() {
			return {
				selRows: [],
				devGroupArr:[],
				devGroupMap : new Map(),
				classifiedConfig: [{
					title: '设备分组:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				queryParam: {},
				tableData: [],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				}
			}
		},
		methods: {
			doDevGroupMaintain() { //设备分组维护
				this.$refs.devGroupWin.show(JSON.parse(JSON.stringify(this.devGroupArr)));
			},
			doAdd() { //新增设备
				this.$refs.formWin.show({});
			},
			doEdit(row) {
				this.$refs.formWin.show({ ...row
				});
			},
			doDel(id) { //删除
				this.$confirm("您确认删除设备MAC？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteDevMac({
							Vue: this,
							params: {
								id: id
							}
						}).then(res => {
							if (res.result)
								this.doSearch()
						})
					})
			},
			doClickHandler(index, option) {
				this.queryParam.devGroupId = option.value;
				this.doSearch();
			},
			doQueryDevGroupList(){
				this.devGroupMap = new Map()
				this.devGroupArr.splice(0,this.devGroupArr.length)
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				devGroupList({
					Vue: this
				}).then(res => {
					if (res.result) {
						this.devGroupArr = res.model;
						let devGroupArr = res.model;
						if (devGroupArr != null && devGroupArr.length > 0) {
							devGroupArr.forEach(devGroup => {
								this.devGroupMap.set(devGroup.id,devGroup.alias)
								devGroup.value = devGroup.id;
								devGroup.label = devGroup.alias;
								this.classifiedConfig[0].options.push(devGroup);
								
							})
							//默认选中第一个
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}
					}
				})
			},
			doSearch(page) {
				let param = { ...this.queryParam
				}
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
				devMacPage({
					Vue: this,
					params: param
				}).then(res => {
					if (res.result) {
						let dataArr =  res.model.items;
						dataArr.forEach(data=>{
							let devGroupIdArr = data.devGroupIds.split(',').map(Number)
							let devGroupNameArr =[]
							devGroupIdArr.forEach(devGroupId=>{
								devGroupNameArr.push(this.devGroupMap.get(devGroupId))
							})
							data.devGroupIds = devGroupIdArr;
							data.devGroupNames = devGroupNameArr.join(',')
						})
						this.tableData = dataArr;
						this.page.total = res.model.numRows
					}
				})
			},
			tableSelectChanged(selectRows) { //勾选
				this.selRows = selectRows
			}
		},
		mounted() {
			this.doQueryDevGroupList();
		},
		components: {
			DevGroupWin, //设备分组维护
			FormWin, //新增设备
		}
	}
</script>
<style lang="less">

</style>
