<template>
	<el-row :gutter="8">
		<el-col :span="9">
			<el-card>
				<storage-form ref="storageForm" />
			</el-card>
		</el-col>
		<el-col :span="15">
			<el-card>
				<storage-echat />
			</el-card>
		</el-col>
		<el-col :span="24" style="margin-top: 10px;">
			<distribute-list ref="distributeList" />
		</el-col>
	</el-row>
</template>

<script>

	import StorageForm from './form.vue'
	import StorageEchat from './echat.vue'
	import DistributeList from './distribute-list.vue'
	export default {
		methods:{
			doSearch(){
				this.$refs.storageForm.doSearch()
				this.$refs.distributeList.doSearch()
			}
		},
		components: {
			DistributeList,
			StorageForm,
			StorageEchat
		}
	}
</script>

<style>

</style>
