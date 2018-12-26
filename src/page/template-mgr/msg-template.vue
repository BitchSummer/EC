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
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" v-show="!editModel" @click="doAdd">新增模版</el-button>
				<el-button icon="el-icon-edit" size="small" style="width: 80px;" :disabled="templateForm==null||templateForm.isAble==true" v-show="!editModel" @click="editModel = true;">编辑</el-button>
				<el-button icon="el-icon-delete" size="small" style="width: 80px;" :disabled="templateForm==null||templateForm.isAble==false" v-show="!editModel" @click="doDelete">删除</el-button>
				<el-button icon="el-icon-setting" size="small" style="width: 80px;" :disabled="templateForm==null" v-show="!editModel" @click="doAbleOrDisable(templateForm.isAbleStr==null?'启/停用':templateForm.isAble=='已停用'?'启用':'停用')">
				{{templateForm.isAble==null?'启/停用':templateForm.isAbleStr=='已停用'?'启用':'停用'}}
				</el-button>
				<el-button icon="el-icon-setting" size="small" style="width: 100px;" v-show="!editModel" @click="sendMsg">测试短信</el-button>
				<el-button icon="el-icon-success" size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doSave">保存</el-button>
				<el-button icon="el-icon-back" size="small" style="width: 80px;" type="danger" v-show="editModel" @click="doSearch">返回</el-button>
			</span>
		</toolbar>
		<el-row :gutter="8">
				<el-col :span="8">
					<el-card>
						<template-form :form="templateForm" ref="templateForm" :edit-model="editModel" @callback="doSearch"/>
					</el-card>	
				</el-col>
					<el-col :span="16">
					<el-card>
						<template-config-form  ref="templateConfigForm"/>
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
	} from '../../api/templatemgr-msgtemplate.js'
	import TemplateForm from '../../components/template-mgr/msg-template/form.vue'
	import TemplateConfigForm from '../../components/template-mgr/msg-template/template-config-form.vue'

	export default {
		components: {
			TemplateForm,
			TemplateConfigForm
		},
		data() {
			return {
				editModel: false,
				queryParam: {
					isAble: ''
				},
				//筛选数据
				classifiedConfig: [{
					title: '短信模版:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				templateForm: {
					paramList:[]
				}
			}
		},
		methods: {
			sendMsg(){
				
			},
			doAdd() {
				this.templateForm = {
					isAbleStr: "已停用",
					isAble: false,
					paramList:[]
				}
				this.editModel = true;
			},
			doDelete() {
				this.$confirm('您确认删除短信模版, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteScheme({
						Vue: this,
						params: {
							id: this.templateForm.id
						},
					}).then(res => {
						if (res.result) {
							this.doSearch();
						}
					})

				});
			},
			doAbleOrDisable(opName) {
				this.$confirm('您确认' + opName + '模版, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					ableOrDisableScheme({
						Vue: this,
						params: {
							id: this.templateForm.id
						},
					}).then(res => {
						if (res.result) {
							this.doSearch();
						}
					})

				});
			},
			doSave() {
					this.$refs.templateForm.doSave();
			},
			doClickHandler(index, option) {
				let templateForm = { ...option
				};
				delete templateForm.label;
				delete templateForm.value;
				delete templateForm.disabled;
				this.templateForm = templateForm
				this.queryTemplateParams();
			},
			queryTemplateParams(){
				schemeParamList({
					Vue: this,
					params: {
						schemeId: this.templateForm.id
					},
				}).then(res => {
					if (res.result) {
						if(res.model!=null&&res.model.length>0){
								this.$set(this.templateForm,'paramList',res.model)
								this.$refs.templateConfigForm.doSearch(this.templateForm)
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