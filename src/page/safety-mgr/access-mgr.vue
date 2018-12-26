<template>
	<div>
		<el-card>
			<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		</el-card>
		<toolbar>
			<span slot="left">
				<span>应用名称:</span>
				<span style="margin: auto 10px; font-size: 12px;">{{app.appName}}</span>
				<span>控制策略:</span>
				<el-radio-group v-model="accessSchemeForm.accessScheme" @change='radioChange'>
                        <el-radio label="完全开放">完全开放</el-radio>
                        <el-radio label="除允许外,其余禁止">除允许外,其余禁止</el-radio>
                        <el-radio label="除禁止外,其余允许">除禁止外,其余允许</el-radio>
                        <el-radio label="完全控制">完全控制</el-radio>
                    </el-radio-group>
			</span>
		</toolbar>
		<el-card style="margin-top: 10px;">
			<el-tabs v-model="activeName" class="app-mgr" >
				<el-tab-pane label="允许MAC列表" :disabled="!(accessSchemeForm.accessScheme=='除允许外,其余禁止'||accessSchemeForm.accessScheme=='完全控制')">
					<access-mac-list :isAllowAccess="true" ref="allowMacList" :id='id'/>
				</el-tab-pane>
				<el-tab-pane label="禁用MAC列表" :disabled="!(accessSchemeForm.accessScheme=='除禁止外,其余允许'||accessSchemeForm.accessScheme=='完全控制')">
					<access-mac-list :isAllowAccess="false" ref="noAllowMacList" :id='id'/>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>

</template>
<script>
	import AccessMacList from '../../components/safety-mgr/access-mgr/access-mac-list.vue'
	import {
		appList
	} from '../../api/resource-appmgr.js'
	import {
		accessSchemeView,
		schemeDetailList,
		saveOrUpdate,
		detailList
	} from '../../api/safetymgr-accessmgr.js'
	export default {
		components: {
			AccessMacList
		},
		data() {
			return {
				isAllowAccess:false,
					page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				appId:'',
				id:'',
				activeName: 'app-mgr',
				//筛选数据
				classifiedConfig: [{
					title: '授权应用:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				app:{},
				accessSchemeForm : {
					accessScheme:"完全开放"
				}
			}
		},
		methods: {
		radioChange(page){
		/* 	detailList({
				Vue:this,
				params:{}
			
			}).then(res=>{

			})
 */
           saveOrUpdate({
					Vue: this,
					params: {appId:this.appId,
							 accessScheme:this.accessSchemeForm.accessScheme,
							 id:this.id}
				}).then(res => {
				})
				if (page == null || page.pageNo == null) {
					this.page.pageNo = 1
				}
             detailList({
					Vue: this,
					params: {
						     id:this.id,
							 isAllowAccess:this.isAllowAccess,
							 pageNo:this.page.pageNo,
							 pageSize:this.page.pageSize
							 }
				}).then(res => {
				})  
			},
			doClickHandler(index, option) {
				this.app = option
				accessSchemeView({
					Vue: this,
					params: {appId:option.value}
				}).then(res => {
					if (res.model!='') {
						this.accessSchemeForm = res.model[0];
						console.log(this.accessSchemeForm,'this.accessSchemeForm')
						this.$refs.allowMacList.doSearch(null,this.accessSchemeForm.appId,this.accessSchemeForm.id)
						this.$refs.noAllowMacList.doSearch(null,this.accessSchemeForm.appId,this.accessSchemeForm.id)
					saveOrUpdate({
					Vue: this,
					params: {appId:option.value,
							 accessScheme:this.accessSchemeForm.accessScheme,
							 id:this.accessSchemeForm.id}
				}).then(res => {
					console.log(res,'res')
					res.accessScheme=this.accessSchemeForm.accessScheme
				})
					}else{
					saveOrUpdate({
					Vue: this,
					params: {appId:option.value,
					         accessScheme:'完全开放'}
				}).then(res => {
				this.id=res.model.id
				this.appId=res.model.appId
				   
				})
					}
				})
			},
			doSearch() {
				appList({
					Vue: this,
					params: {}
				}).then(res => {
					if (res.result) {
						let appArr = res.model;
						this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
						if (appArr != null && appArr.length > 0) {
							appArr.forEach(item => {
								item.value = item.id;
								item.label = item.appName;
								this.classifiedConfig[0].options.push(item);
							})
							//默认选中第一个
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}
					}
				})
			}

		},
		mounted() {
			this.doSearch();
		}
	}
</script>
<style lang="less">

</style>