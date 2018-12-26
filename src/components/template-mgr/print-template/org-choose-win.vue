<template>
	<toast :config="config" @cancel="config.dialogVisible=false;" @doSave="doSave" >
		<org-tree ref="orgTree" style="margin: 15px;"/>
	</toast>
</template>

<script>
	import OrgTree from './org-tree.vue'
	export default {
		data() {
			return {
				config: { //办结弹窗数据
					title: "部门选择", //弹窗标题
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
			show(){
				this.config.dialogVisible = true;
			},
			doSave(){
				let currNode =this.$refs.orgTree.getCurrNode();
				if(currNode==null){
					this.$message({
					  message: '请选择部门...',
					  type: 'warning'
					});
					return;
				}else{
					this.$emit('callback',currNode)
					this.config.dialogVisible = false;
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
