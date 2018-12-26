<template>
	<div>
		<el-row :gutter="8">
			<el-col :span="7">
				<el-card>
					<role-edit-tree @doAdd="doAdd" @doEdit="doEdit"/>
				</el-card>
			</el-col>
			<el-col :span="17">
			
				<toolbar style="margin-bottom: 10px;">
					<span slot="right">
						<el-button size="small" type="danger" :disabled="!editModel" icon="el-icon-check" @click="doSave">保存</el-button>
					</span>
				</toolbar>
				<el-card>

				<role-form ref="roleForm" :form="roleForm" :editModel="editModel"/>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import RoleEditTree from '../../components/grant-mgr/role-mgr/role-edit-tree.vue'
	import RoleForm from '../../components/grant-mgr/role-mgr/role-form.vue'
	import { 
		saveOrUpdateRole
		 } from '../../api/grantmgr-rolemgr.js'
	export default {
		data() {
			return {
				currNode: null,
				roleForm:{},
				opType:'',
				editModel: false
			}
		},
		methods:{
			doAdd(node, data){
				this.opType ='addRole';
				this.currNode = node;
				this.roleForm ={
					parentId:data.id,
					parentName:data.alias,
					isLeaf:true
				}
				this.editModel = true;
			},
			doEdit(node, data){
				this.currNode = node;
				this.roleForm ={...data}
				this.editModel = true;
			},
			doSave(){
				console.log(this.roleForm)
				saveOrUpdateRole({
					Vue: this,
					params: this.roleForm
				}).then(res => {
					if (res.result) {
						
						if(this.opType=='addRole'){
							this.roleForm.id = res.model;
							if(!this.currNode.loaded){
								if(this.currNode.isLeaf){
									this.$set(this.currNode,'isLeaf',false)
									this.$set(this.currNode,'loaded',false)
								}
							}else{
								this.currNode.insertChild({data:this.roleForm})
							}
						}else{
							this.currNode.data={...this.roleForm}
						}
						this.opType='';
					}
				});
				
				
				
			}
		},
		components: {
			RoleEditTree,
			RoleForm
		}
	}
</script>
<style lang="less">

</style>
