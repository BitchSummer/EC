<template>
	<el-row :gutter="8">
				<el-col :span="9">
					<el-card>
						<msg-form ref="msgForm" />
					</el-card>
				</el-col>
				<el-col :span="15">
					<el-card>
						<msg-echat />
					</el-card>
				</el-col>
				<el-col :span="24" style="margin-top: 10px;">
					<msg-app-used-list ref="appUsedList" />
				</el-col>
					</el-row>
</template>

<script>

	import MsgForm from './form.vue'
	import MsgEchat from './echat.vue'
	import MsgAppUsedList from './msg-app-used-list.vue'
	export default {
		methods:{
			doSearch(){
				this.$refs.msgForm.doSearch()
				this.$refs.appUsedList.doSearch()
			}
		},
		components: {
			MsgForm,
			MsgEchat,
			MsgAppUsedList
		}
	}
</script>

<style>

</style>
