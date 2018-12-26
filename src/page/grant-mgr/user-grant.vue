<template>
	<div>
		<el-tabs v-model="activeName" @tab-click="doTabClick">
			<el-tab-pane label="用户组" name="user-group">
				<user-group ref="userGroup" />
			</el-tab-pane>
			<el-tab-pane label="人员授权" name="user-grant">
				<user-grant ref="userGrant"/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import UserGroup from '../../components/grant-mgr/user-grant/user-group.vue'
	import UserGrant from '../../components/grant-mgr/user-grant/user-grant-list.vue'

	export default {
		data() {
			return {
				activeName:'user-group'
			};	
		},
		methods:{
			doTabClick(){
				if(this.activeName=='user-group')
					this.$refs.userGroup.doSearch();
				else{
					this.$refs.userGrant.doSearch(null,this.$refs.userGroup.getUserGroupArr());
				}
			}
		},
		components: {
			UserGroup,
			UserGrant
		},
		mounted(){
			this.doTabClick();
		}
	}
</script>

<style>

</style>
