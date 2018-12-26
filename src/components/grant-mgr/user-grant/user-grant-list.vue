<template>
	<div>
		
		<el-row :gutter="8">
			<el-col :span="6">
				<el-card>
					<org-tree ref="orgTree" @nodeChange="doQueryUser"/>
				</el-card>
			</el-col>
			<el-col :span="18">
				<toolbar style="margin-bottom: 10px;">
					<span slot="left">
								<el-input size="small" style="width: 150px;" placeholder="用户名搜索...." v-model="queryParam.userName"/>
								<el-input size="small" style="width: 150px;" placeholder="手机号码搜索...." v-model="queryParam.phone"/>
								<el-select size="small" style="width: 150px;" v-model="queryParam.userGroupId" placeholder="请选择用户组" >
									<el-option
									v-for="userGroup in userGroupArr"
									:key="userGroup.id"
									:label="userGroup.alias"
									:value="userGroup.id">
									</el-option>
								</el-select>
								<el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
								<el-button size="small" type="danger" icon="el-icon-close" @click="queryParam={isAble:''};">清空条件</el-button>
							</span>
					<span slot="right">
						<el-select size="small" v-model="grantUserGroupId" style="width: 150px;" placeholder="请选择授权用户组" >
							<el-option
							v-for="userGroup in userGroupArr"
							:key="userGroup.id"
							:label="userGroup.alias"
							:value="userGroup.id">
							</el-option>
						</el-select>
						<el-button size="small" type="danger" icon="el-icon-check" :disabled="selRows.length==0||grantUserGroupId==''" @click="doBatchGrant">批量授权</el-button>
					</span>
				</toolbar>
				<el-table height="600" border stripe ref="table" :data="tableData"  @selection-change="tableSelectChanged"
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
					<el-table-column resizable show-overflow-tooltip property="userGroupName" align="center" label="用户组" width="120" />
				
				</el-table>
				<div class="my-pagination">
					<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
				</div>
			</el-col>
			
		</el-row>
	</div>
</template>

<script>
	import OrgTree from '../../orguser-mgr/org-mgr/org-tree.vue'
	import {
		userPage,
		grantUserGroup
		} from '../../../api/orgusermgr-usermgr.js'
	export default {
		data() {
			return {
				selRows:[],
				grantUserGroupId:'',
				userGroupArr:[],
				queryParam:{},
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData: []
			};
		},
		methods:{
			doSearch(page,userGroupArr) {
				if(userGroupArr!=null)
					this.userGroupArr = userGroupArr;
				let queryParam = { ...this.queryParam
				};
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
				queryParam.pageNo = this.page.pageNo;
				queryParam.pageSize = this.page.pageSize;
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
			doQueryUser(orgNode){
				if(orgNode.data.id==0)
					delete this.queryParam.orgId
				else
					this.queryParam.orgId=orgNode.data.id
				this.doSearch()
			},
			doBatchGrant(){
				let userIds =[];
				this.selRows.forEach(item=>{
					userIds.push(item.id)
				})
				grantUserGroup({
					Vue: this,
					params: {
						userIds:userIds,
						userGroupId:this.grantUserGroupId
					}
				}).then(res => {
					if (res.result) {
						this.grantUserGroupId='';
						this.doSearch()
					}
				})
			},
			tableSelectChanged(selection) {
				this.selRows = selection;
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
			OrgTree
		}
	}
</script>

<style>

</style>
