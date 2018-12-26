<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave">
		<el-form :model="form" ref="form" :rules="rules" label-width="100px" class="view-form">

			<el-form-item label="所属部门:" prop="orgName">
				<el-input size="mini" v-model="form.orgName"></el-input>
			</el-form-item>

			<el-form-item label="用户名:" prop="orgCode">
				<el-input size="mini" v-model="form.userName" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="手机号码:" prop="phone">
				<el-input size="mini" v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item label="Email:" prop="email">
				<el-input size="mini" v-model="form.email"></el-input>
			</el-form-item>
			<el-form-item label="备注:">
				<el-input size="mini" type="textarea" v-model="form.remark"></el-input>
			</el-form-item>
		</el-form>
	</toast>
</template>

<script>
	import {
		saveOrUpdateUser
	} from '../../../api/orgusermgr-usermgr.js'
	export default {
		data() {
			return {
				form:{},
				rules:{
					
				},
				config: { //办结弹窗数据
					title: "用户维护", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "600px", //弹窗宽
					btnData: [{
						name: '取消', //按钮名
						method: 'cancel', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}, {
						name: '保存', //按钮名
						method: 'doSave', //回调函数
						bgColor: 'dialog-deep-blue'

					}]
				}
			};
		},
		methods:{
			show(currOrg,user){
				this.form = {...user};
				this.form.orgId = currOrg.id;
				this.form.orgName = currOrg.orgName;
				this.config.dialogVisible = true;
			},
			doSave(){
				saveOrUpdateUser({
					Vue: this,
					params: this.form
				}).then(res => {
					if (res.result){
						this.form.id = res.model;
						this.$emit('callback',this.form)
						this.config.dialogVisible = false;
					}
				})
			}
		}
	}
</script>

<style>

</style>
