<template>
	<div>
		<el-card>
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		</el-card>
		<toolbar style="margin: 10px auto;">
			<span slot="right">
				<el-button size="small" type="primary" icon="el-icon-plus" @click="doAdd" v-show="!editModel">新增用户组</el-button>
				<el-button size="small" icon="el-icon-edit" @click="editModel = true;" v-show="!editModel">编辑</el-button>
				<el-button size="small" icon="el-icon-delete" @click="doDel" v-show="!editModel">删除</el-button>
				<el-button icon="el-icon-setting" size="small" :disabled="userGroupForm==null" v-show="!editModel" @click="doAbleOrDisable(userGroupForm.isAble==null?'启/停用':userGroupForm.isAble=='已停用'?'启用':'停用')">
					{{userGroupForm.isAble==null?'启/停用':userGroupForm.isAble=='已停用'?'启用':'停用'}}
				</el-button>
				<el-button size="small" icon="el-icon-view" @click="permissionList" v-show="!editModel">权限清单</el-button>
				<el-button size="small" icon="el-icon-success" @click="doSave" v-show="editModel">保存</el-button>
				<el-button size="small" icon="el-icon-back" @click="doSearch" v-show="editModel">返回</el-button>
			</span>
		</toolbar>
		<el-card>
			<el-form :model="userGroupForm" ref="form" :rules="rules" label-width="160px" class="view-form">
				<h1> 用户组信息 </h1>
				<el-form-item label="岗位名称:" prop="alias">
					<el-input size="mini" v-model="userGroupForm.alias" :disabled="!editModel"></el-input>
				</el-form-item>
				<el-form-item label="授权角色:" prop="alias">
					<el-select size="small" v-model="userGroupForm.roleIds" multiple placeholder="请选择" @change="dataHandler">
						<el-option
						  v-for="role in roleArr"
						  :key="role.id"
						  :label="role.label"
						  :value="role.id">
						</el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="授权应用:">
					<el-tag v-for="item in dataHandler()" style="margin-right: 10px;">{{item.label}}</el-tag>
				</el-form-item>
				<el-form-item label="备注:">
					<el-input size="mini" type="textarea" :rows="5" v-model="userGroupForm.remark" :disabled="!editModel"></el-input>
				</el-form-item>
				<el-form-item label="启停标识:">
					<el-input size="mini" v-model="userGroupForm.able ? '启用' : '停用'" disabled></el-input>
				</el-form-item>
				<el-form-item label="启停时间:">
					<el-input size="mini" v-model="userGroupForm.ableTime" disabled></el-input>
				</el-form-item>
			</el-form>
		</el-card>
		<userToast ref="userToast"></userToast>	
	</div>

</template>

<script>
	import {
		userGroupList,
		deleteUserGroup,
		saveOrUpdateUserGroup,
		ableOrDisableUserGroup,
		permissionList
	} from '../../../api/grantmgr-usergrant.js'
	import userToast from './user-group-toast.vue'
	import {
		roleRefAppList
		} from '../../../api/grantmgr-rolemgr.js'
	export default {
		data() {
			return {
				userGroupArr:[],
				userGroupForm: {
					roleIds:[]
				},
				roleArr:[],
				userGroupRefApps:[],
				roleAppMap:new Map(),
				classifiedConfig: [{
					title: '用户组:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				editModel: false,
				rules: {

				}
			};
		},
		components:{
			userToast
		},
		methods: {
			permissionList(){
				this.$refs.userToast.show(this.userGroupForm.id);
			},
			dataHandler(){
				let userGroupRefApps =[];
				let appIds = [];
				this.userGroupForm.roleIds.forEach(roleId=>{
					let roleRefApps = this.roleAppMap.get(roleId);
					if(roleRefApps!=null&&roleRefApps.length>0){
						roleRefApps.forEach(app=>{
							if(appIds.indexOf(app.id)==-1){
								userGroupRefApps.push(app)
							}
						})
					}
					
				})
				this.userGroupRefApps = userGroupRefApps;
				///去重
				let obj={}
				let result =[];
				for(let it in userGroupRefApps){
					if(!obj[userGroupRefApps[it].id]){
						result.push(userGroupRefApps[it]);
						obj[userGroupRefApps[it].id] = true;
					}
				}
				return result;
			},
			doAdd(){
				this.editModel = true;
				this.userGroupForm ={
					alias:'',
					isAble:'已停用',
					roleIds:[]
				}
			},
			doDel(){
				this.$confirm("您确认删除用户组？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteUserGroup({
							Vue: this,
							params: {
								id: this.userGroupForm.id
							}
						}).then(res => {
							if (res.result) {
								this.doSearch();
							}
						})
					})
			},
			doAbleOrDisable(opText){
				this.$confirm("您确认"+opText+"用户组？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						ableOrDisableUserGroup({
							Vue: this,
							params: {
								id: this.userGroupForm.id
							}
						}).then(res => {
							if (res.result) {
								this.doSearch();
							}
						})
					})
			},
			doSave() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						let form = {...this.userGroupForm}
						form.roleIds = form.roleIds.join(',')
						saveOrUpdateUserGroup({
							Vue: this,
							params: form
						}).then(res => {
							if (res.result){
								this.doSearch();
							}
						})
					}
				})
			},
			loadRoleList(){
				this.roleArr.splice(0,this.roleArr.length);
				this.roleAppMap = new Map();
				roleRefAppList({
					Vue: this
				}).then(res => {
					if (res.result){
						let roleRefAppArr = res.model;
						if(roleRefAppArr!=null&&roleRefAppArr.length>0){
							let roleIdArr =[];
							roleRefAppArr.forEach(roleRefApp=>{
								if(roleIdArr.indexOf(roleRefApp.roleId)==-1){
									roleIdArr.push(roleRefApp.roleId);
									this.roleArr.push({
										id:roleRefApp.roleId,
										label:roleRefApp.roleName
									})
									this.roleAppMap.set(roleRefApp.roleId,[{
										id:roleRefApp.appId,
										label:roleRefApp.appName
									}])
								}else{
									this.roleAppMap.get(roleRefApp.roleId).push({
										id:roleRefApp.appId,
										label:roleRefApp.appName
									});
								}
							})
						}
					}
				})
			},
			doClickHandler(index, option) {
				let tempForm = {...option}
				delete tempForm.value;
				delete tempForm.label;
				if(tempForm.roleIds==null)
					tempForm.roleIds =[]
				else
					tempForm.roleIds = tempForm.roleIds.split(',').map(Number)
				this.userGroupForm = tempForm;
			},
			doSearch(){
				this.editModel = false;
				this.classifiedConfig[0].options.splice(0,this.classifiedConfig[0].options.length);
				userGroupList({
					Vue: this
				}).then(res => {
					if (res.result) {
						let userGroupArr = res.model;
						this.userGroupArr =userGroupArr;
						if(userGroupArr!=null&&userGroupArr.length>0){
							userGroupArr.forEach(userGroup=>{
								userGroup.value = userGroup.id;
								userGroup.label = userGroup.alias;
								this.classifiedConfig[0].options.push(userGroup);
							})
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}
					}
				});
			},
			getUserGroupArr(){
				return this.userGroupArr;
			}
		},
		mounted(){
			this.loadRoleList()
		}
	}
</script>

<style lang="less">
	.view-form {
		h1 {
			margin: 20px;

		}
	}
</style>
