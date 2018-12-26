<template>
		<el-form :model="form" ref="form" :rules="rules" label-width="160px" class="view-form">
			<h1> 角色信息维护 </h1>
			<el-form-item label="上级角色:" prop="parentName">
				<el-input size="mini" v-model="form.parentName" disabled></el-input>
			</el-form-item>

			<el-form-item label="角色名称:" prop="alias">
				<el-input size="mini" v-model="form.alias" :disabled="!editModel || (form.id==0)"></el-input>
			</el-form-item>
			<el-form-item label="备注:">
				<el-input size="mini" type="textarea" :rows="5" v-model="form.remark" :disabled="!editModel || (form.id==0)"></el-input>
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
