<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave" >
		<el-checkbox-group v-model="grantAppIdArr" style="margin: 20px;">
			<el-checkbox :label="app.id" v-for="app in companyRefAppArr">{{app.appName}}</el-checkbox>
		</el-checkbox-group>
	</toast>
</template>

<script>
	import {
		companyRefAppList,
		roleGrantApps
		} from '../../../api/grantmgr-appgrant.js'
	export default {
		data() {
			return {
				grantAppIdArr:[],
				roleId:0,
				companyRefAppArr:[],
				config: { //办结弹窗数据
					title: "应用授权", //弹窗标题
					dialogVisible: false, //弹窗显示
					width: "600px", //弹窗宽
					btnData: [{
						name: '取消', //按钮名
						method: 'cancel', //回调函数
						bgColor: 'dialog-white' //按钮背景
					}, {
						name: '确认选择', //按钮名
						method: 'doSave', //回调函数
						bgColor: 'dialog-deep-blue'

					}]
				}
			};
		},
		methods:{
			show(roleId,grantAppIdArr){
				this.roleId = roleId;
				this.grantAppIdArr = grantAppIdArr;
				companyRefAppList({
					Vue: this
				}).then(res => {
					if (res.result) {
						this.companyRefAppArr = res.model;
						this.config.dialogVisible = true;
					}
				});
				
			},
			doSave(){
				roleGrantApps({
					Vue: this,
					params:{
						roleId: this.roleId,
						appIds: this.grantAppIdArr
					}
				}).then(res => {
					if (res.result) {
						this.config.dialogVisible = false;
						this.$emit("callback")
					}
				});
			}
		}
	}
</script>

<style>

</style>
