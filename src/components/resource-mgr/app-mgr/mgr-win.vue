<!--
  规格配置
 -->

<template>
	<!-- 查看弹出框 -->
	<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave" >
		<el-form :model="config.form" ref="form" :rules="rules" label-width="100px" class="view-form">
			<el-row :gutter="8">
				<el-col :span="24">
					<el-form-item label="管理人" prop="manger">
						<el-input size="mini" v-model="config.form.manger" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="手机号码" prop="phone">
						<el-input size="mini" v-model="config.form.phone" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="到期提醒" prop="dateAlertType">
					  <el-radio-group v-model="config.form.dateAlertType" size="mini">
							<el-radio-button label="week">一周前</el-radio-button>
							<el-radio-button label="one-month">一月前</el-radio-button>
							<el-radio-button label="three-month">三月前</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="短信模板" prop="msgTemplateId">
						<el-input size="mini" v-model="config.form.msgTemplateId" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-input size="mini" type="textarea" v-model="config.form.msgTemplate" ></el-input>
				</el-col>
				
			</el-row>
		</el-form>

	</toast>
	<!-- 查看弹出框 -->
</template>

<script>
	import {
		saveMgrSet,
		viewMgrSet
		 } from '../../../api/resource-appmgr.js'
	export default {
		data(){
			return {
				rules:{
					manger: [{
						required: true,
						message: '请输入管理人...',
						trigger: 'change'
					}],
					phone: [{
						required: true,
						message: '请输入手机号码...',
						trigger: 'change'
					}],
					dateAlertType: [{
						required: true,
						message: '请输入日期预警类型...',
						trigger: 'change'
					}],
					amountAlertValue: [{
						required: true,
						message: '请输入超量阀值...',
						trigger: 'change'
					}],
					msgTemplateId: [{
						required: true,
						message: '请选择短信模板...',
						trigger: 'change'
					}]
				},
				config: {
					title: "管理人设置维护", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "600px", //弹窗宽
					form:{
					},
					btnData: [{
							isShow: true,
							name: "取消",
							bgColor: "dialog-normal",
							method: "cancel"
						},
						{
							isShow: true,
							name: "保存设置",
							bgColor: "dialog-deep-blue",
							method: "doSave"
						}
					]
				}
			}
		},
		methods: {
			show(){
				viewMgrSet({
					Vue: this,
					params: {
						businessType:'company-app'
					},
				}).then(res => {
					if (res.result) {
						this.config.form = res.model;
						this.config.dialogVisible = true;
					}
				})
			},
			doSave() {
				this.config.form.businessType = 'company-app'
				this.$refs['form'].validate((valid) => {
					if (valid) {
						saveMgrSet({
							Vue: this,
							params: this.config.form,
						}).then(res => {
							if (res.result) {
								this.config.dialogVisible = false;
								this.$emit("callback");
							}
						})
					}
				});
			}
		}
	}
</script>
<style lang="less">
	.view-form{
		margin: auto 20px;
		h1{
			font-size: 15px;
			margin: 15px auto;
		}
		.el-form-item {
				margin-bottom: 5px;
		}
	}
</style>
