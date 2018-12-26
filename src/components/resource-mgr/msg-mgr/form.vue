<!--
  规格配置
 -->

<template>
	<el-form :model="form" ref="form" label-width="100px" class="view-form">
				<el-form-item label="累计申购(条):">
					{{form.purchaseCount}}
				</el-form-item>
				<el-form-item label="累计发送(条):">
					{{form.usedCount}}

				</el-form-item>
				<el-form-item label="当前剩余(条):">
					{{form.monthBalance}}
				</el-form-item>
		
			<el-button type="primary" size="small" @click="mgrSet">管理人设置</el-button>
		<mgr-win ref="mgrWin" />
	</el-form>
</template>

<script>
	import {
		monthMsg
	} from '../../../api/resource-msgmgr.js'
	import MgrWin from './mgr-win.vue'
	export default {
		data() {
			return {
				form: {}
			}
		},
		methods: {
			mgrSet() {
				this.$refs.mgrWin.show('company-msg');
			},
			doSearch() {
				monthMsg({
					Vue: this
				}).then(res => {
					if (res.result) {
						this.form = res.model;
					}
				})
			}
		},
		components: {
			MgrWin
		}
	}
</script>
<style lang="less">
	.view-form {
		margin: auto 20px;

		h1 {
			font-size: 15px;
			margin: 15px auto;
		}

		.el-form-item {
			margin-bottom: 5px;
		}
	}
</style>
