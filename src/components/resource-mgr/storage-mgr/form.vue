<!--
  规格配置
 -->

<template>
	<el-form :model="form" ref="form" label-width="100px" class="view-form">
		<el-row>
			<el-col :span="24">
				<el-form-item label="月度容量(GB):">
					{{form.monthCapacity}}
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="分配容量(GB):">
					{{form.distributeCapacity}}

				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="分配剩余(GB):">
					{{form.balanceDistributeCapacity}}
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="使用容量(GB):">
					{{form.usedCapacity}}
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="实际剩余(GB):">
					{{form.balanceCapacity}}
				</el-form-item>
			</el-col>
			<el-button type="primary" size="small" @click="mgrSet">管理人设置</el-button>
		</el-row>
		<mgr-win ref="mgrWin" />
	</el-form>
</template>

<script>
	import {
		monthStorage
	} from '../../../api/resource-storagemgr.js'
	import MgrWin from './mgr-win.vue'
	export default {
		data() {
			return {
				form: {}
			}
		},
		methods: {
			mgrSet() {
				this.$refs.mgrWin.show('company-storage');
			},
			doSearch() {
				monthStorage({
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
