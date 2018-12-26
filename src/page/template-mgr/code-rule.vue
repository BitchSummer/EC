<!--
  短信模版
 -->
<template>
	<div class="market-mgr">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbar class="custom-toolbar">
			<span slot="left">
				<el-radio-group size="small" v-model="queryParam.isAble" @change="doSearch">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="true">只显示启用</el-radio-button>
					<el-radio-button label="false">只显示停用</el-radio-button>
				</el-radio-group>
			</span>
			<span slot="right">
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" v-show="!editModel" @click="doAdd">新增规则</el-button>
				<el-button icon="el-icon-edit" size="small" style="width: 80px;" :disabled="ruleForm==null||ruleForm.isAble==true" v-show="!editModel" @click="editChange">编辑</el-button>
				<el-button icon="el-icon-delete" size="small" style="width: 80px;" :disabled="ruleForm==null||ruleForm.isAble==true" v-show="!editModel" @click="doDelete">删除</el-button>
				<el-button icon="el-icon-setting" size="small" style="width: 80px;" :disabled="ruleForm==null" v-show="!editModel" @click="doAbleOrDisable(ruleForm.isAble==null?'启/停用':ruleForm.isAbleStr=='已停用'?'启用':'停用')">
					{{ruleForm.isAble==null?'启/停用':ruleForm.isAbleStr=='已停用'?'启用':'停用'}}
				</el-button>
				<el-button icon="el-icon-setting" size="small" style="width: 100px;" v-show="!editModel" @click="sendMsg">测试短信</el-button>
				<el-button icon="el-icon-success" size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doSave">保存</el-button>
				<el-button icon="el-icon-back" size="small" style="width: 80px;" type="danger" v-show="editModel" @click="doSearch">返回</el-button>
			</span>
		</toolbar>
		<el-row :gutter="8">
				<el-col :span="8">
					<el-card>
						<rule-form :form="ruleForm" ref="ruleForm" :edit-model="editModel" @callback="doSearch"/>
					</el-card>	
				</el-col>
				<el-col :span="16">
					<el-card >
						<rule-config-list  ref="ruleConfigKust"  :edit-model="editModel" :ruleId='ruleId' :paramLabelList='paramLabelList'/>
					</el-card>
				</el-col>
		</el-row>
	</div>
</template>
<script>
	import {
		schemeList,
		schemeParamList,
		deleteScheme,
		ableOrDisableScheme
	} from '../../api/templatemgr-coderule.js'
	import RuleForm from '../../components/template-mgr/code-rule/form.vue'
	import RuleConfigList from '../../components/template-mgr/code-rule/rule-config-list.vue'
	export default {
		components: {
			RuleForm,
			RuleConfigList
		},
		data() {
			return {
				paramLabelList:[],
				mod:'',
				paramId:'',
				ruleId:'',
				editModel: false,
				queryParam: {
					isAble: ''
				},
				//筛选数据
				classifiedConfig: [{
					title: '编码规则:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				ruleForm: {
					paramList:[]
				}
			}
		},
		methods: {
			editChange(){
				this.mod="edit"
				this.editModel = true;
				this.$refs.ruleConfigKust.doConfig()
			},
			sendMsg(){
				
			},
			doAdd() {
				this.mod="add"
				this.ruleForm = {
					isAble: false,
					paramList:[],
					isAbleStr: "已停用"
				}
				this.editModel = true;
			},
			doDelete() {
				this.$confirm('您确认删除编码规则, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteScheme({
						Vue: this,
						params: {
							id: this.ruleForm.id
						},
					}).then(res => {
						if (res.result) {
							this.doSearch();
						}
					})

				});
			},
			doAbleOrDisable(opName) {
				this.$confirm('您确认' + opName + '规则, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					ableOrDisableScheme({
						Vue: this,
						params: {
							id: this.ruleForm.id
						},
					}).then(res => {
						if (res.result) {
							this.doSearch();
						}
					})

				});
			},
			doSave() {
				if(this.mod == 'add'){
				this.$refs.ruleForm.doSave();
				}else if(this.mod == 'edit'){
			    this.$refs.ruleForm.doSave();
				this.$refs.ruleConfigKust.doSave()
				}
	
			},
			doClickHandler(index, option){
				let ruleForm = { ...option};
				console.log(ruleForm.id,'ruleForm.id')
				delete ruleForm.label;
				delete ruleForm.value;
				delete ruleForm.disabled;
				this.ruleForm = ruleForm
				this.queryTemplateParams();
	  			this.$refs.ruleConfigKust.doSearch(this.ruleForm.id)  
			},
			queryTemplateParams(){
				schemeParamList({
					Vue: this,
					params: {
						schemeId: this.ruleForm.id
					},
				}).then(res => {
					if (res.result) {
						if(res.model!=null&&res.model.length>0){
								this.$set(this.ruleForm,'paramList',res.model)
								this.paramLabelList=res.model
								res.model.forEach(item=>{	
								if(item){
									}
								})
						}
						
					}
				})
			},
			doSearch() {
				this.editModel= false;
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				schemeList({
					Vue: this,
					params: this.queryParam,
				}).then(res => {
					if (res.result) {
						let schemeArr = res.model;
						if (schemeArr != null && schemeArr.length > 0) {
							schemeArr.forEach(scheme => {
								scheme.label = scheme.alias
								scheme.value = scheme.id;
								if (scheme.isAbleStr == '已停用')
									scheme.disabled = true
									this.classifiedConfig[0].options.push(scheme);
							});							
							//默认选中第一个
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}

					}
				})
			}
		},
		mounted: function () {
			this.doSearch();
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
</style>