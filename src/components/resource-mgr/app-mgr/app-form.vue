<!--
  规格配置
 -->

<template>
		<el-form :model="form" ref="form" label-width="100px" class="view-form">

			<el-row>
				<el-col :span="8">
					<el-form-item label="应用名称:">
						<el-input size="mini" v-model="form.appName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="行业领域:">
						<el-input size="mini" v-model="form.industry" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="应用类型:">
						<el-input size="mini" v-model="form.appClass" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="服务商:">
						<el-input size="mini" v-model="form.providerName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="应用地址:">
						<el-input size="mini" v-model="form.appUrl" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="授权地址:">
						<el-input size="mini" v-model="form.authUrl" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="应用说明:">
						<el-input size="mini" type="textarea" v-model="form.appDesc" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="支持云存储:">
						<el-radio-group size="mini" v-model="form.isNeedStorage">
						  <el-radio-button label="是">必须具备</el-radio-button>
						  <el-radio-button label="否">暂无需求</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="支持短信:">
						<el-radio-group size="mini" v-model="form.isNeedMsg">
							<el-radio-button label="是">必须具备</el-radio-button>
							<el-radio-button label="否">暂无需求</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="应用图标:">
						<el-input size="mini" v-model="form.appImgUrl" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

</template>

<script>
	export default {
		props: ['form']
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
