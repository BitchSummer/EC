<template>
	<div>
		<el-form ref="form" :model="form" label-width="120px">
		 <el-row>
		   <el-col :span="5">
			<el-form-item label="设备组:" prop="devGroupIds">
				<el-select v-model="form.devGroupIds"  placeholder="请选择设备组" size="small">
					<el-option :label="item.alias" :value="item.id" v-for="item in devGroupArr" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			 </el-col>
			 <el-col :span="5">
			 <el-form-item label="设备部门:" prop="orgNamePath">
				<el-select  placeholder="请输入关键词" v-model="form.orgNamePath"
				 size="small" >
					<el-option :label="org.treeNamePath" :value="org.treeNamePath" v-for="org in orgArr" :key="org.id"></el-option>
				</el-select>
			</el-form-item>
			 </el-col>
			 <el-col :span="5">
			 <el-form-item label="MAC地址:" prop="devMac">
				<el-select  placeholder="请输入关键词"  v-model="form.devMac"
				 size="small" >
					<el-option :label="org.devMac" :value="org.devMac" v-for="org in devGroupNameArr" :key="org.id"></el-option>
				</el-select>
			</el-form-item>
			 </el-col>
		  </el-row>
		</el-form>
		<toolbar>
			<span slot="right">
				<el-button size="small" style="width: 100px;" type="primary" @click="doBatchAdd">批量添加</el-button>
				<el-button size="small" style="width: 100px;" plain @click="doRemove" >批量移除</el-button>
			</span>
		</toolbar>
		<el-card style="clear:both;">
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" >
				<el-table-column type="selection" width="35" />
				<el-table-column resizable show-overflow-tooltip property="devGroupNames" align="center" label="设备组" />
				<el-table-column resizable show-overflow-tooltip property="orgNamePath" align="center" label="部门路径" />
				<el-table-column resizable show-overflow-tooltip property="userName" align="center" label="设备责任人" width="150" />
				<el-table-column resizable show-overflow-tooltip property="devType" align="center" label="设备分类" width="120" />
				<el-table-column resizable show-overflow-tooltip property="devMac" align="center" label="MAC地址" width="300" />
				<el-table-column resizable show-overflow-tooltip property="remark" align="center" label="备注" />
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</el-card>
	</div>
</template>
<script>
	import {
		devGroupList,
		devMacPage,
		saveOrUpdate,
		deleteApp,
		saveDetail
	} from '../../../api/safetymgr-macmgr.js'
	import {
		orgList
	} from '../../../api/orgusermgr-orgmgr.js'
	import { schemeDetailList } from '../../../api/safetymgr-accessmgr.js'
	export default {
		props: ['isAllowAccess','id'],
		data() {
			return {
				orgArr:[],
				devGroupNameArr:[],
				devGroupArr:[],
				form:{
					devGroupIds:"",
					devMac:'',
					orgNamePath:''
				},
				paramType:'',
				paramTypeOp:[],
				queryParam: {},
				tableData: [],
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				}
				
			}
		},
		mounted(){
				devMacPage({
					Vue: this,
					params: {
						pageSize: 10000
					}
				}).then(res => {
					if (res.result) {
						let dataArr =  res.model.items;
				/* 		dataArr.forEach(data=>{
							let devGroupIdArr = data.devGroupIds.split(',').map(Number)
							let devGroupNameArr =[]
							devGroupIdArr.forEach(devGroupId=>{
								devGroupNameArr.push(this.devGroupMap.get(devGroupId))
							})
							data.devGroupIds = devGroupIdArr;
							data.devGroupNames = devGroupNameArr.join(',')
						}) */
						this.devGroupNameArr = dataArr;
					}
				})
			    this.queryOrgList(),
				devGroupList({
					Vue: this
				}).then(res => {
					if (res.result) {
						this.devGroupArr = res.model;
						let devGroupArr = res.model;
						if (devGroupArr != null && devGroupArr.length > 0) {
							devGroupArr.forEach(devGroup => {
								/* this.devGroupMap.set(devGroup.id,devGroup.alias) */
								devGroup.value = devGroup.id;
								devGroup.label = devGroup.alias;
	/* 							this.classifiedConfig[0].options.push(devGroup); */
								
							})
							//默认选中第一个
						/* 	this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0]) */
						}
					}
				})
		},
		methods: {
            doBatchAdd(){
				if(this.form.devGroupIds==undefined){
					this.form.devGroupIds=''
				}else if(this.form.orgNamePath==undefined){
					this.form.orgNamePath=''
				}else if(this.form.devMac==undefined){
					this.form.devMac=''
				}else if(this.form.devGroupIds==undefined&&this.form.orgNamePath==undefined){
					this.form.devGroupIds=''
					this.form.orgNamePath=''
				}else if(this.form.devGroupIds==undefined&&this.form.devMac==undefined){
					this.form.devGroupIds=''
					this.form.devMac=''
				}else if(this.form.orgNamePath==undefined&&this.form.devMac==undefined){
					this.form.orgNamePath=''
					this.form.devMac=''
				}else if(this.form.orgNamePath==undefined&&this.form.devMac==undefined&&this.form.devGroupIds==undefined){
					this.form.orgNamePath=''
					this.form.devMac=''
					this.form.devGroupIds=''
				}
               	devMacPage({
					Vue: this,
					params: {
						devGroupId:this.form.devGroupIds,
						orgNamePath:this.form.orgNamePath,
						devMac:this.form.devMac,
					}
				}).then(res => {
					if (res.result) {
						this.tableData =  res.model.items;
						res.model.items.forEach(
							item=>{
					   console.log(item,'item')
					   let devId=item.id
					   let param=[]
					   param.push({schemeId:this.id,isAllowAccess:this.isAllowAccess,devId:devId})
					console.log(param,'param')
					  		saveDetail({
					Vue: this,
					params: param
				}).then(res => {
					if (res.result) {

							}
				}) 
							}
						)
			
				/* 		dataArr.forEach(data=>{
							let devGroupIdArr = data.devGroupIds.split(',').map(Number)
							let devGroupNameArr =[]
							devGroupIdArr.forEach(devGroupId=>{
								devGroupNameArr.push(this.devGroupMap.get(devGroupId))
							})
							data.devGroupIds = devGroupIdArr;
							data.devGroupNames = devGroupNameArr.join(',')
						}) */
					/* 	this.devGroupNameArr = dataArr; */
					}
				})
			},
			queryOrgList() {
	/* 			this.orgArr.splice(0, this.orgArr.length)  */
					orgList({
						Vue: this,
						params: {
							/* orgName: queryStr */
						}
					}).then(res => {
						if (res.result) {
							this.orgArr = res.model
						}
					})
				
			},
			doRemove(id) {
 				this.$confirm("您确认删除应用APP？", "系统提示", {
 						confirmButtonText: "确定",
 						cancelButtonText: "取消",
 						type: "warning"
 					})
 					.then(() => {
 						deleteApp({
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
			doSearch(page,appId,schemeId) {
				if(schemeId!=null&&schemeId>0){
					this.queryParam.appId=appId;
					this.queryParam.schemeId=schemeId;
				}
					
				this.queryParam.isAllowAccess =Boolean(this.isAllowAccess) 
				let param = { ...this.queryParam
				}
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				param.pageNo = this.page.pageNo
				param.pageSize = this.page.pageSize
				schemeDetailList({
					Vue: this,
					params: param
				}).then(res => {
					if (res.result) {
						console.log(res.model)
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