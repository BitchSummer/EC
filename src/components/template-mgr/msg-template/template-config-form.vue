<template>
	<div>
		<div>
			<h1 style="float: left;">模板配置</h1>
			<div style="float: right;">
				  <el-button type="primary" size="small" v-show="!editModel" @click="editModel=true">模板配置</el-button>
				  <el-button type="danger" size="small" v-show="editModel" @click="doSave()">保存</el-button>
			</div>
		</div>	
		<div style="margin: 5px 10px; clear: both;">
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" ref="searchData" />
			<el-input type="textarea" :autosize="{ minRows: 4}"  v-model="templateConfig.templateStr" :disabled="!editModel" />
		</div>
		<el-tag v-for="param in templateConfig.params" :key="param.id" :closable="editModel" @close="delParam(param)" >
			{{param.paramLabel}}
		</el-tag>
	</div>
</template>

<script>
	import {
		viewTemplateConfig,
		saveOrUpdateTemplateConfig
	} from '../../../api/templatemgr-msgtemplate.js'
	export default {
		data() {
			return {
				editModel:false,
				//筛选数据
				classifiedConfig: [{
					title: '模板参数:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				templateConfig: {
					template:'',
					templateStr: '',
					paramIds: [],
					params: []
				}
			}

		},
		methods: {
			doClickHandler(index, option) {
				if(!this.editModel)
					return;
				this.templateConfig.templateStr = this.templateConfig.templateStr + option.paramLabel;
				if (this.templateConfig.paramIds.indexOf(option.value) == -1) {
					this.templateConfig.params.push(option)
					this.templateConfig.paramIds.push(option.value);
				}

			},
			doSave() {
				let temp = {...this.templateConfig}
				temp.template = temp.templateStr;
				temp.params.forEach(param => {
					let label = param.paramLabel.replace(/\(/g, "\\(")
					label = label.replace(/\)/g, "\\)")
					temp.template  = temp.template.replace(new RegExp(label, "gm"), "$"+"("+param.id+")")
				});
				temp.paramIds =temp.paramIds.join(',')
				temp.templateId = this.templateForm.id
				delete temp.params
				
				saveOrUpdateTemplateConfig({
					Vue: this,
					params: temp
				}).then(res => {
					if (res.result){
						this.editModel= false
					}
				})
				
			},
			delParam(param) {
				let label = param.paramLabel.replace(/\(/g, "\\(")
				label = label.replace(/\)/g, "\\)")
				let temStr = this.templateConfig.templateStr;
				temStr = temStr.replace(new RegExp(label, "gm"), "")
				this.templateConfig.templateStr = temStr

				let index_ = this.templateConfig.paramIds.indexOf(param.id)
				this.templateConfig.params.splice(index_, 1);
				this.templateConfig.paramIds.splice(index_, 1);

			},
			doSearch(templateForm){
				this.templateForm = templateForm
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				if(templateForm.paramList!=null&&templateForm.paramList.length>0){
					templateForm.paramList.forEach(param=>{
						param.label = param.paramLabel;
						param.value = param.id;
						this.classifiedConfig[0].options.push(param);
					})
				}
				viewTemplateConfig({
					Vue: this,
					params: {
						templateId: templateForm.id
					}
				}).then(res => {
					if (res.model!==undefined){
						let temp = res.model;
						if(temp!=null){
							if(temp.paramIds!=null){
								temp.paramIds =temp.paramIds.split(',').map(Number)
								temp.params =[]
								if(templateForm.paramList!=null&&templateForm.paramList.length>0){
									templateForm.paramList.forEach(param=>{
										if(temp.paramIds.indexOf(param.id)>-1)
											temp.params.push(param)
									})
								}
							}
							
						}
						this.templateConfig = temp
					}else{
                      this.templateConfig=''
					}
				})
			}
		}
	}
</script>
<style scoped="scoped">
	.el-tag {
		margin-left: 10px;
	}
</style>
