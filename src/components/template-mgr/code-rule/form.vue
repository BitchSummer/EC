<template>
	<div>
		<h1>模版概况</h1>
		<el-form ref="form" class="rbox-form" size="small" :rules="rules" :model="form" label-width="130px">
					<el-form-item label="规则编码:" prop="ruleCode">
						<el-input :disabled="!editModel" v-model="form.ruleCode"></el-input>
					</el-form-item>
					<el-form-item label="规则名称:" prop="alias">
						<el-input :disabled="!editModel" v-model="form.alias"></el-input>
					</el-form-item>
					<el-form-item label="分隔符:" prop="separator">
						<el-input :disabled="!editModel" v-model="form.separator"></el-input>
					</el-form-item>
					<el-form-item label="启停标识:">
						<el-tag type="success" v-show="form.isAble==true">{{form.isAbleStr}}</el-tag>
						<el-tag type="danger" v-show="form.isAble==false">{{form.isAbleStr}}</el-tag>
					</el-form-item>
					<el-form-item label="启停时间:">
						<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
						 placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
		</el-form>
	<h1>参数维护</h1>
		<el-tag v-for="item in form.paramList" v-show="item.deleted=='F'" @click.native="specConfig">{{item.paramCode}}-{{item.paramLabel}}</el-tag>
		<el-button size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doParamMaintain">点击维护</el-button>
		<param-maintain ref="paramMaintain" @doSave="doParamSure" />
	</div>
</template>
<script>
	import {
		saveOrUpdateScheme
	} from '../../../api/templatemgr-coderule.js'
	import ParamMaintain from './param-maintain.vue'
	import bus from './eventBus.js'
	export default {
		props: ['form', 'editModel'],
		data() {
			return {
				rules: { //校验
					ruleCode: [{
						required: true,
						message: '请输入规则编码',
						trigger: 'blur'
					}], //模版编码
					alias: [{
						required: true,
						message: '请输入规则名称',
						trigger: 'blur'
					}], //模版名称
				/* 	separator: [{
						required: true,
						message: '请输入分隔符',
						trigger: 'blur'
					}] */
				}
				
			}
		},
		methods: {
/* 			specConfig(){
				let mod='flase'
				bus.$emit('configChange',mod)
			}, */
			doParamMaintain() {
				this.$refs.paramMaintain.show(this.form.paramList);
			},
			doParamSure(tempArr) {
				this.$set(this.form,'paramList',tempArr)
			/* 	this.form.paramList = tempArr */
				console.log(this.form.paramList,this.form,'this.form.paramListsss')
			},
			doSave(){
				this.$refs.form.validate((valid) => {
					let param={...this.form}
					delete param.createTime
					delete param.modifyTime
					param.paramList.forEach(item=>{
						delete item.createTime
						delete item.modifyTime
					})
				  if (valid) {
					saveOrUpdateScheme({
						Vue: this,
						params: param
					}).then(res => {
						if (res.result){
							this.$emit('callback')
						}
					})
				  } 
				});
				
			}
		},
		components:{
			ParamMaintain
		}
	}
</script>
<style lang="less">
	.market-mgr {
		h1 {
			line-height: 40px;
		}

		.el-tag {
			margin: 5px;
		}

		.el-input.is-disabled .el-input__inner {
			width: 171px;
		}
	}
</style>
