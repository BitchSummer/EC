<!--
  规格配置
 -->

<template>
		<el-form :model="form" ref="form" label-width="100px" class="view-form">
				<h1>菜单详情</h1>
					<el-form-item label="菜单名称:">
						<el-input size="mini" v-model="form.menuName" disabled></el-input>
					</el-form-item>
					<el-form-item label="菜单链接:">
						<el-input size="mini" v-model="form.menuPath" disabled></el-input>
					</el-form-item>
					<el-form-item label="操作控制:">
						<el-input size="mini" v-model="form.isBtnCtr" disabled></el-input>
					</el-form-item>
					<el-form-item label="操作按钮:" v-show="form.isBtnCtr=='操作控制'">
						<el-tag size="small" style="margin-right: 10px;" v-for="item in form.btnArr">{{item.btnName}}</el-tag>
					</el-form-item>
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
			font-size: 20px;
			margin: 10px auto;
			text-align: center;
		}
		.el-form-item {
			margin-bottom: 5px;
		}
	}
</style>
