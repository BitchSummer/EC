<!--
  规格配置
 -->

<template>
	<div>
		
</div>
</template>

<script>
	export default {
		methods: {
			callback() {
				this.$emit("sure");
			}
		}
	}
</script>
<style lang="less">
	.view-form{
		margin: auto 20px;
		h1{
			font-size: 15px;
			margin: 15px auto;
		}
		.el-form-item {
				margin-bottom: 5px;
		}
	}
</style>
