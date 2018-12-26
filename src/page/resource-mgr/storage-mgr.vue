<template>
	<div>
		
				<el-card>
					<el-tabs v-model="activeName" class="storage-mgr" @tab-click="doTabClick">
						<el-tab-pane label="云存储分配" name="storage-distribute">
							<storage-distribute ref="storageDistribute"/>
						</el-tab-pane>
						<el-tab-pane label="日志记录" name="storage-used-log">
							<storage-used-log ref="storageUsedLog"/>
						</el-tab-pane>
					</el-tabs>
				</el-card>

			

	</div>
</template>
<script>
	import StorageDistribute from '../../components/resource-mgr/storage-mgr/storage-distribute.vue'
	import StorageUsedLog from '../../components/resource-mgr/storage-mgr/storage-used-log.vue'
	export default {
		components: {
			StorageDistribute,
			StorageUsedLog
		},
		data() {
			return {
				activeName: 'storage-distribute'
			}
		},
		methods: {
			
			doTabClick(){
				if(this.activeName=='storage-distribute')
					this.$refs.storageDistribute.doSearch();
				else
					this.$refs.storageUsedLog.doSearch();
			}
		},
		mounted() {
			this.doTabClick();
		}
	}
</script>
<style lang="less">

</style>
