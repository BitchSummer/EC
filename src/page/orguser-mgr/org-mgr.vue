<template>
	<div>
		<el-row :gutter="8">
			<el-col :span="7">
				<el-card>
					<org-edit-tree @doAdd="doAdd" @doEdit="doEdit"/>
				</el-card>
			</el-col>
			<el-col :span="17">
				<toolbar style="margin-bottom: 10px;">
					<span slot="right">
						<el-button size="small" type="danger" :disabled="!editModel" icon="el-icon-check" @click="doSave">保存</el-button>
					</span>
				</toolbar>
				<el-card>
				<org-form ref="orgForm" :form="orgForm" :editModel="editModel"/>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import OrgEditTree from '../../components/orguser-mgr/org-mgr/org-edit-tree.vue'
	import OrgForm from '../../components/orguser-mgr/org-mgr/org-form.vue'
	import { 
		saveOrUpdateOrg
		 } from '../../api/orgusermgr-orgmgr.js'
	export default {
		data() {
			return {
				currOrgNode: null,
				orgForm:{},
				opType:'',
				editModel: false
			}
		},
		methods:{
			doAdd(node, data){
				this.opType ='addOrg';
				this.currOrgNode = node;
				this.orgForm ={
					parentId:data.id,
					parentName:data.orgName,
					isLeaf:true
				}
				this.editModel = true;
			},
			doEdit(node, data){
				this.currOrgNode = node;
				this.orgForm ={...data}
				this.editModel = true;
			},
			doSave(){
				saveOrUpdateOrg({
					Vue: this,
					params: this.orgForm
				}).then(res => {
					if (res.result) {
						if(this.opType=='addOrg'){
							this.orgForm.id = res.model;
							if(!this.currOrgNode.loaded){
								if(this.currOrgNode.isLeaf){
									this.$set(this.currOrgNode,'isLeaf',false)
									this.$set(this.currOrgNode,'loaded',false)
								}
							}else{
								this.currOrgNode.insertChild({data:this.orgForm})
							}
						}else{
							this.currOrgNode.data={...this.orgForm}
						}
						this.opType='';
					}
				});
				
				
				
			}
		},
		components: {
			OrgEditTree,
			OrgForm
		}
	}
</script>
<style lang="less">

</style>
