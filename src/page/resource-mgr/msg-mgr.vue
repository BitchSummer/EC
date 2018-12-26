<template>
	<div>
		
				<el-card>
					<el-tabs v-model="activeName" class="msg-mgr" @tab-click="doTabClick">
						<el-tab-pane label="短信使用" name="msg-used">
							<msg-used ref="msgUsed"/>
						</el-tab-pane>
						<el-tab-pane label="日志记录" name="msg-used-log">
							<msg-used-log ref="msgUsedLog"/>
						</el-tab-pane>
					</el-tabs>
				</el-card>

			

	</div>
</template>
<script>
	import MsgUsed from '../../components/resource-mgr/msg-mgr/msg-used.vue'
	import MsgUsedLog from '../../components/resource-mgr/msg-mgr/msg-used-log.vue'
	export default {
		components: {
			MsgUsed,
			MsgUsedLog
		},
		data() {
			return {
				activeName: 'msg-used'
			}
		},
		methods: {
			
			doTabClick(){
				if(this.activeName=='msg-used')
					this.$refs.msgUsed.doSearch();
				else
					this.$refs.msgUsedLog.doSearch();
			}
		},
		mounted() {
			this.doTabClick();
		}
	}
</script>
<style lang="less">

</style>
