<!--
  新增设备
 -->

<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave">
		<el-form :model="config.form" ref="form" :rules="rules" label-width="120px" style="margin: auto 20px;">

			<el-form-item label="设备部门:" prop="orgNamePath">
				<el-select filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="queryOrgList" v-model="config.form.orgNamePath"
				 size="small" @change="doOrgChange">
					<el-option :label="org.treeNamePath" :value="org.treeNamePath" v-for="org in orgArr" :key="org.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="设备责任人:" prop="userName">
				<el-select filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="queryUserList" v-model="config.form.userName"
				 size="small" @change="doUserChange">
					<el-option :label="user.userName" :value="user.userName" v-for="user in userArr" :key="user.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="MAC地址:" prop="devMac">
				<el-input size="small" v-model="config.form.devMac"></el-input>
			</el-form-item>
			<el-form-item label="设备类型:" prop="devType">
				<el-select v-model="config.form.devType" placeholder="请选择设备类型" size="small">
					<el-option :label="item" :value="item" v-for="item in devTypeOpArr" :key="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="设备组:" prop="devGroupIds">
				<el-select v-model="config.form.devGroupIds" multiple placeholder="请选择设备组" size="small">
					<el-option :label="item.alias" :value="item.id" v-for="item in devGroupArr" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注:">
				<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="config.form.remark">
				</el-input>
			</el-form-item>
		</el-form>
	</toast>

</template>

<script>
	import {
		saveOrUpdateDevMac
	} from '../../../api/safetymgr-macmgr.js'
	import {
		orgList
	} from '../../../api/orgusermgr-orgmgr.js'
	import {
		userList
	} from '../../../api/orgusermgr-usermgr.js'
	export default {
		props: ['devGroupArr'],
		data() {
			return {
				orgId:'',
				orgArr: [],
				userArr: [],
				devTypeOpArr: ['工作机', '家用机', '移动设备'],
				rules: { //校验
					orgId: [{
						required: true,
						message: '请输入部门',
						trigger: 'blur'
					}], //部门
					userId: [{
						required: true,
						message: '请输入设备责任人',
						trigger: 'blur'
					}], //人员搜索
					devMac: [{
						required: true,
						message: '请输入设备MAC地址',
						trigger: 'blur'
					}], //请输入MAC地址
					devType: [{
						required: true,
						message: '请输入设备类型',
						trigger: 'blur'
					}], //设备类型
					devGroupIds: [{
						required: true,
						message: '请选择设备分组',
						trigger: 'change'
					}], //设备分组
				},

				config: { //新增设备弹窗
					title: "设备MAC维护", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "500px", //弹窗宽
					form: {},
					btnData: [{
						isShow: true,
						name: "取消",
						bgColor: "info",
						method: "cancel"
					}, {
						disabled: false,
						isShow: true,
						bgColor: 'dialog-deep-blue',
						name: '保存', //按钮名
						method: 'doSave', //回调函数
					}]
				}
			}
		},
		methods: {
			show(form) {
				this.config.form = form;
				this.config.dialogVisible = true;
			},
			queryOrgList(queryStr) {
				this.orgArr.splice(0, this.orgArr.length)
				if (queryStr !== '') {
					orgList({
						Vue: this,
						params: {
							orgName: queryStr
						}
					}).then(res => {
						if (res.result) {
							this.orgArr = res.model
						}
					})
				}
			},
			doOrgChange(treeNamePath){
					this.config.form.orgId = this.orgArr.filter(item=>item.treeNamePath==treeNamePath)[0].id
					this.orgId=this.config.form.orgId
			},
			queryUserList(queryStr,orgId) {
				this.userArr.splice(0, this.userArr.length)
				if (queryStr !== '') {
					userList({
						Vue: this,
						params: {
							userName: queryStr,
							orgId:this.orgId
						}
					}).then(res => {
						if (res.result) {
							this.userArr = res.model
						}
					})
				}
			},
			doUserChange(userName){
				this.config.form.userId = this.userArr.filter(item=>item.userName==userName)[0].id
			},
			doSave() { //保存
				this.$refs['form'].validate((valid) => {
					if (valid) {
						let tempForm = { ...this.config.form
						}
						tempForm.devGroupIds = tempForm.devGroupIds.join(',')
						saveOrUpdateDevMac({
							Vue: this,
							params: tempForm
						}).then(res => {
							if (res.result) {
								this.config.dialogVisible = false;
								this.$emit("callback")
							}
						})
					}
				});
			}
		}
	}
</script>
<style lang="less">
	.view-form {
		margin: auto 20px;

		h1 {
			font-size: 15px;
			margin: 15px auto;
		}

		.el-form-item {
			margin-bottom: 5px;
		}

		.el-input__inner {
			// margin-top: 10px;
			height: 30px;
		}
	}
</style>
