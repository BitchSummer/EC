<template>
	<div>
		<h1>模版概况</h1>
		<el-form ref="form" class="rbox-form" size="small" :rules="rules" :model="form" label-width="130px">
					<el-form-item label="模版编码:" prop="templateCode">
						<el-input :disabled="!editModel" v-model="form.templateCode"></el-input>
					</el-form-item>
					<el-form-item label="模版名称:" prop="alias">
						<el-input :disabled="!editModel" v-model="form.alias"></el-input>
					</el-form-item>
					<el-form-item label="启停标识:">
						<el-tag type="success" v-show="form.isAble==true">{{form.isAbleStr}}</el-tag>
						<el-tag type="danger" v-show="form.isAble==false">{{form.isAbleStr}}</el-tag>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker disabled v-model="form.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
						 placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="更新时间">
						<el-date-picker disabled v-model="form.modifyTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
						 placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="启停时间:">
						<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
						 placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
		</el-form>
		<h1>参数维护</h1>
		<el-tag v-for="item in form.paramList" v-show="item.deleted=='F'">{{item.paramCode}}-{{item.paramLabel}}</el-tag>
		<el-button size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doParamMaintain">点击维护</el-button>
		<param-maintain ref="paramMaintain" @doSave="doParamSure" />
	</div>


</template>
<script>
	import {
		saveOrUpdateScheme
	} from '../../../api/templatemgr-msgtemplate.js'
	import ParamMaintain from './param-maintain.vue'
	export default {
		props: ['form', 'editModel'],
		data() {
			return {
				rules: { //校验
					templateCode: [{
						required: true,
						message: '请输入模版编码...',
						trigger: 'blur'
					}], //模版编码
					alias: [{
						required: true,
						message: '请输入模版名称...',
						trigger: 'blur'
					}] //模版名称
				}
				
			}
		},
		methods: {
			doParamMaintain() {
				this.$refs.paramMaintain.show(this.form.paramList);
			},
			doParamSure(tempArr) {
				this.form.paramList = tempArr
				console.log(this.form.paramList,'this.form.paramListsss')
			},
			doSave(){
				let param = {...this.form}
				delete param.createTime
				delete param.modifyTime
				delete param.ableTime
				param.paramList.forEach(item=>{ 
					delete item.createTime
					delete item.modifyTime
					delete item.label
					delete item.value
				})
				this.$refs.form.validate((valid) => {
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
