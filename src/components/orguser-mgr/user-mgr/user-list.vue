<template>
	<div>
		<toolbar style="margin-bottom: 10px;">
			<span slot="left">
						<el-input size="small" style="width: 150px;" placeholder="用户名搜索...." v-model="queryParam.userName"/>
						<el-input size="small" style="width: 150px;" placeholder="手机号码搜索...." v-model="queryParam.phone"/>
						<el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
						<el-button size="small" type="danger" icon="el-icon-close" @click="queryParam={isAble:''};">清空条件</el-button>
					</span>
			<span slot="right">
				<el-button size="small" type="primary" icon="el-icon-plus" @click="doAdd" :disabled="currOrg==null">新增用户</el-button>
				<el-button size="small" icon="el-icon-delete" @click="doBatchDel" :disabled="batchStatus">批量删除</el-button>
				<el-button size="small" icon="el-icon-refresh" @click="doResetPsw" :disabled="batchStatus!='已启用'">重置密码</el-button>
				<el-button size="small" icon="el-icon-setting" @click="doMove" :disabled="batchStatus">批量移动</el-button>
			</span>
		</toolbar>
		<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @selection-change="tableSelectChanged"
		@row-click="tableRowClick">
			<el-table-column type="selection" width="55" />
			<el-table-column resizable show-overflow-tooltip property="isAble" align="center" label="启停标识" width="100">
				<template slot-scope="scope">
					<el-tag size="medium" :type="scope.row.isAble==false?'danger':'success'">{{ scope.row.isAble?'启用':'停用' }}</el-tag>
				</template>
			</el-table-column>
		
			<el-table-column resizable show-overflow-tooltip property="orgNamePath" align="center" label="部门路径" width="150" />
			<el-table-column resizable show-overflow-tooltip property="userName" align="center" label="用户名" width="150" />
			<el-table-column resizable show-overflow-tooltip property="phone" align="center" label="手机号码" />
			<el-table-column resizable show-overflow-tooltip property="email" align="center" label="Email" />
			<el-table-column resizable show-overflow-tooltip property="ableTime" align="center" label="启停时间" width="120" />
			<el-table-column label="操作" align="center" width="150">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="doEdit(scope.row)">编辑</el-button>
					<el-button size="mini" type="text" @click="doAbleOrDisable(scope.row,scope.row.isAble==false?'启用':'停用')">{{scope.row.isAble==false?'启用':'停用'}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="my-pagination">
			<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
		</div>
		<user-win ref="userWin" @callback="callback"/>
		<org-choose-win ref="orgChooseWin" @callback="moveCallBack"/>
	</div>
</template>

<script>
	import {
		userPage,
		ableOrDisableUser,
		resetPsw,
		deleteUser,
		moveUser
		} from '../../../api/orgusermgr-usermgr.js'
	import UserWin from './user-win.vue'
	import OrgChooseWin from '../org-mgr/org-choose-win.vue'

	export default {
		// props: ['currOrg'],
		data() {
			return {
				currOrg:null,
				queryParam:{},
				batch:true,
				selRows :[],
				batchStatus:true,
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData: []
			};
		},
		methods:{
			callback(){
				this.doSearch()
			},
			setCurOrg(data){
				this.currOrg = data
			},
			doSearch(page) {
				let queryParam = { ...this.queryParam
				};
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				if(this.currOrg!=null){
					queryParam.orgId = this.currOrg.id;
					queryParam.pageNo = this.page.pageNo;
					queryParam.pageSize = this.page.pageSize;
				}
				
				userPage({
					Vue: this,
					params: queryParam
				}).then(res => {
					if (res.result) {
						this.tableData = res.model.items;
						this.page.total = res.model.numRows;
					}
				})
			},
			doAdd(){
				this.$refs.userWin.show(this.currOrg,{});
			},
			doEdit(row){
				this.$refs.userWin.show(this.currOrg,row);
			},
			doBatchDel(){
				this.$confirm("您确认删除用户？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let ids =[];
						this.selRows.forEach(user=>{
							ids.push(user.id)
						})
						deleteUser({
							Vue: this,
							params: {
								ids: ids
							}
						}).then(res => {
							if (res.result){
								this.doSearch()
							}
						})
					})
			},
			doResetPsw(){
				this.$confirm("您确认重置用户密码，重置密码为123456？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let ids =[];
						this.selRows.forEach(user=>{
							ids.push(user.id)
						})
						resetPsw({
							Vue: this,
							params: {
								ids: ids
							}
						}).then(res => {
							if (res.result){
								this.doSearch()
							}
						})
					})
			},
			doMove(){
				this.$refs.orgChooseWin.show();
			},
			moveCallBack(targetNode){
				this.$confirm('您确定将用户移动至选中部门, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let ids =[];
					this.selRows.forEach(user=>{
						ids.push(user.id)
					})
					moveUser({
						Vue: this,
						params: {
							ids: ids,
							orgId: targetNode.data.id
						}
					}).then(res => {
						if (res.result) {
							this.doSearch()
						}
					})
				}).catch(() => {
									
				});
			},
			doAbleOrDisable(row,opFlag){
				this.$confirm("您确认"+opFlag+"用户？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						ableOrDisableUser({
							Vue: this,
							params: {
								ids: row.id,
								isAble:row.isAble?false:true
							}
						}).then(res => {
							if (res.result){
								this.doSearch()
							}
						})
					})
				
			},
			tableSelectChanged(selection) {
				this.selRows = selection;				
				this.$emit("setSelectRows",selection)
				/////
				if(this.selRows.length==0){
					this.batchStatus = true;
					return;
				}
				let tag = false;
				for(let attr in this.selRows){
					if(this.selRows[attr].isAble==true){
						tag = true;
						break;
					}
				}
				this.batchStatus = tag;
			},
			tableRowClick(row) {
				if (row) {
					this.$refs.table.toggleRowSelection(row);
				} else {
					this.$refs.table.clearSelection();
				}
			}
		},
		
		components: {
			UserWin,
			OrgChooseWin
		}
	}
</script>

<style>

</style>
