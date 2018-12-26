<template>
	<div>
		<el-row :gutter="8">
			<el-col :span="7">
				<el-card>
					<org-tree ref="orgTree" @nodeChange="nodeChange"/>
				</el-card>
			</el-col>
			<el-col :span="17">
				<el-card>
					<user-list ref="userList"/>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import OrgTree from '../../components/orguser-mgr/org-mgr/org-tree.vue'
	import UserList from '../../components/orguser-mgr/user-mgr/user-list.vue'

	export default {
		data() {
			return {
				currOrg: null
			}
		},
		methods:{
			nodeChange(node){
				if(node.data.id==0){
					this.currOrg = null;
				}else{
					let CurOrg = this.$refs.userList;
					if(CurOrg){
						CurOrg.setCurOrg(node.data)
						setTimeout(()=>{
							CurOrg.doSearch();
						},300)
					}
					// this.currOrg= node.data;
					
					
				}
			}
		},
		components: {
			OrgTree,
			UserList
		}
	}
</script>
<style lang="less">

</style>
