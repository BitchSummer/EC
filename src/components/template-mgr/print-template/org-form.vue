<template>
		<el-form :model="form" ref="form" :rules="rules" label-width="160px" class="view-form">
			<h1> 部门信息维护 </h1>
			<el-form-item label="上级部门:" prop="parentName">
				<el-input size="mini" v-model="form.parentName" disabled></el-input>
			</el-form-item>

			<el-form-item label="部门编码:" prop="orgCode">
				<el-input size="mini" v-model="form.orgCode" placeholder="请选择应用类型" :disabled="!editModel"></el-input>
			</el-form-item>
			<el-form-item label="部门名称:" prop="orgName">
				<el-input size="mini" v-model="form.orgName" :disabled="!editModel"></el-input>
			</el-form-item>
			<el-form-item label="备注:">
				<el-input size="mini" type="textarea" :rows="5" v-model="form.remark" :disabled="!editModel"></el-input>
			</el-form-item>
		</el-form>
</template>

<script>
	export default {
		props: ['form','editModel'],
		data() {
			return {
				rules:{
					
				}
			};
		}
	}
</script>

<style lang="less">
	.view-form{
		h1{
			margin: 20px;
			
		}
	}
</style>
