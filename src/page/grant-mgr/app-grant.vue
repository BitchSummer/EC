<template>
	<div>
		<el-row :gutter="8">
			<el-col :span="6">
				<el-card>
					<role-tree ref="roleTree" @nodeChange="doRoleChange" />
				</el-card>
			</el-col>
			<el-col :span="18">
				<el-row :gutter="8">
					<el-col :span="24">
						<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
						<toolbar style="margin: 10px auto">
							<span slot="left">
								<el-button size="small" type="danger" icon="el-icon-share" :disabled="roleId==0||tableData.length==0" @click="doAppMenuGrant">保存菜单授权</el-button>
							</span>
							<span slot="right">
								<el-button size="small" type="primary" icon="el-icon-share" :disabled="roleId==0" @click="doAppGrant">应用授权</el-button>
								<el-button size="small" type="danger" icon="el-icon-share" :disabled="roleId==0||tableData.length==0" @click="operation">操作授权</el-button>
							</span>
						</toolbar>
					</el-col>
					<el-col :span="7">
						<el-card>
							<menu-tree ref="menuTree" :showCheckbox="true" :menuMap="menuMap" />
						</el-card>
					</el-col>
					<el-col :span="17">
						<btn-list ref="btnList" :tableData="tableData" :roleRefMenuBtnMap="roleRefBtnMap" />
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<app-grant-win ref="appGrantWin" @callback="loadRoleRefApps" />
	</div>
</template>

<script>
	import RoleTree from '../../components/grant-mgr/role-mgr/role-tree.vue'
	import MenuTree from '../../components/resource-mgr/app-mgr/menu-tree.vue'
	import BtnList from '../../components/resource-mgr/app-mgr/btn-list.vue'

	import AppGrantWin from '../../components/grant-mgr/app-grant/app-grant-win.vue'

	import {
		roleRefAppList,
		roleRefBtnList,
		roleRefMenuList,
		roleGrantAppMenu,
		roleGrantAppBtns
	} from '../../api/grantmgr-appgrant.js'

	import {
		appMenuList
	} from '../../api/resource-appmgr.js'
	export default {
		data() {
			return {
				classifiedConfig: [{
					title: '授权应用:',
					options: []
				}],
				roleId: 0,
				appId: 0,
				tableData: [],
				roleIdRefAppId: [],
				defaultCheckedKeys: [],
				defaultExpandedKeys: [],
				menuMap: new Map(),
				roleRefBtnMap: new Map(),
				selectedItems: [{
					value: '',
					expanded: false
				}]
			};
		},
		mounted(){
			let tree = this.$refs.menuTree.$refs.tree;
			if(tree){
				tree.treeData=[{
					id:0,
					menuName:"暂无数据...",
					children:[]
				}]
			}
		},
		methods: {
			// nodeLabelClicked(node){
			// 	// this.doRoleChange(node);
			// 	this.loadRoleRefBtnList(this.roleId, node.data.appId);
			// 	console.log("nodelabelclicked==>",node.data);
			// },
			operation(){
				let ids=[];
				let menuId = '';
				for(let item of this.tableData){
					for(let it of item.btnList){
						if(it.check==true){
							menuId = it.menuId
							ids.push(it.id)
						}
					}
				}
				// let ids =[];
				// for(let item of this.tableData.btnList){
				// 	console.log(item,'~~~~~~~~~')
				// }
				// console.log("debuger===>",ids,this.tableData);
				// return;

				roleGrantAppBtns({
					Vue:this,
					params:{
						menuId:menuId,
						appId:this.tableData[0].appId,
						roleId:this.roleId,
						btnIds:ids.join(',')
					}
				}).then(res=>{

				})
			},
			doRoleChange(node) {
				this.roleId = node.data.id;
				this.loadRoleRefApps()
			},
			doAppGrant() {
				this.$refs.appGrantWin.show(this.roleId, this.roleIdRefAppId);
			},
			doAppMenuGrant() {
				var keys = this.$refs.menuTree.$refs.tree.$refs.modelTree.getCheckedKeys()
				var keys_ =[];
				for(let attr in keys){
					if(keys[attr]!=0){
						keys_.push(keys[attr])
					}
				}				
				if(keys[0]==0){
					delete keys[0]
				}
				roleGrantAppMenu({
					Vue: this,
					params: {
						roleId: this.roleId,
						appId: this.appId,
						menuIds: keys_.join(',')
					}
				}).then(res => {
					if (res.result) {
						this.$message({
							message: '菜单授权成功...',
							type: 'success'
						});
					}
				});
			},
			loadRoleRefApps() {
				this.roleIdRefAppId.splice(0, this.roleIdRefAppId.length);
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				if (this.roleId > 0) {
					roleRefAppList({
						Vue: this,
						params: {
							roleId: this.roleId
						}
					}).then(res => {
						if (res.result) {
							let appArr = res.model;
							if (appArr != null && appArr.length > 0) {
								appArr.forEach(app => {
									app.value = app.id;
									app.label = app.appName;
									this.roleIdRefAppId.push(app.id)
									this.classifiedConfig[0].options.push(app);
								});
								this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
								this.doClickHandler(0, this.classifiedConfig[0].options[0])
							}
						}
					});
				}
			},
			loadRoleRefBtnList(roleId, appId) {
				this.tableData = [];
				this.tableData.splice(0, this.tableData.length);
				this.roleRefBtnMap = new Map()
				roleRefBtnList({
					Vue: this,
					params: {
						appId: appId,
						roleId: this.roleId
					}
				}).then(res => {
					if (res.result) {
						let appMenuBtnList = res.model.appMenuList;
						// let appMenuBtnList = res.model.appMenuBtnList;
						// let roleRefBtnList = res.model.roleRefBtnList;
						// if(!appMenuBtnList || (!roleRefAppList)){
						// 	return;
						// }
						// if (roleRefBtnList != null && roleRefBtnList.length > 0) {
						// 	roleRefBtnList.forEach(roleRefBtn => {
						// 		if (this.roleRefBtnMap.has(roleRefBtn.menuId)) {
						// 			this.roleRefBtnMap.get(roleRefBtn.menuId).push(roleRefBtn.btnId)
						// 		} else
						// 			this.roleRefBtnMap.set(roleRefBtn.menuId, [roleRefBtn.btnId])
						// 	});
						// }
						// let temp =[];
						// for(let item of appMenuBtnList){
						// 	if(undefined== item.valueArr)item.valueArr = [];
						// 	temp.push(item);
						// }
						
						this.tableData = appMenuBtnList;
						
					}
				});
			},
			loadAppMenu(appId, appName) {
				let tree = this.$refs.menuTree.$refs.tree;
				if(tree){
					let temp=[{
						id: 0,
						menuName: appName,
						isLeaf: false,
						children:[]
					}]
					tree.treeData = temp;
					this.$refs.menuTree.setCheckKeys([]); 
					appMenuList({
						Vue: this,
						params: {
							appId: appId
						}
					}).then(res => {
					let node =tree.getNodeById(0);
					if(res.model == undefined){
						this.$set(node.data,'isLeaf',true)
					}else{
						node.data.isLeaf = false
					}
					if(res.model){
						if(node && res.model.length>0){
							node.data.children= res.model;
							/////////////////////////////////////////////////
							roleRefMenuList({
								Vue: this,
								params: {
									roleId: this.roleId,
									appId: appId
								}
							}).then(res => {
								if (res.result) {
									let roleRefMenu = res.model||[];
									if (roleRefMenu != null && roleRefMenu.length > 0) {
										let menuIds = [];
										roleRefMenu.forEach(item => {
											menuIds.push(item.menuId)
										});
										setTimeout(() => {
											this.$refs.menuTree.setCheckKeys(menuIds);
										}, 1000)
									}
								}
							});	
							/////////////////////////////////////////////////
							setTimeout(()=>{
								node.expanded = true;
								node.loaded = true;
								setTimeout(()=>{
									let node_ = tree.getNodeById(res.model[0].id);
									if(node_){
										let label=tree.$refs['nodeLabel_'+ res.model[0].id];
										if(label){
											label.click();
										}
									}
								},500)								
							},100)
						}
					 }
				})
					
				}else{
					this.$message.error("页面加载有误！请刷新重试...")
				}
				// console.log(tree);
				return;


				let menuTreeRoot = this.$refs.menuTree.getRootNode().childNodes[0];
				menuTreeRoot.data.menuName = appName;
				menuTreeRoot.childNodes.splice(0, menuTreeRoot.childNodes.length);
				menuTreeRoot.loaded = false;
				menuTreeRoot.expanded = false;
				appMenuList({
					Vue: this,
					params: {
						appId: appId
					}
				}).then(res => {
					if (res.result) {
						let menuArr = res.model?res.model:[];
						var tree = this.$refs.roleTree.$refs.tree
						if(tree){
							console.log(tree,'*************')
						}
						// return;
						let folderArr = []
						this.menuMap = new Map();
						if (menuArr != null && menuArr.length > 0) {
							menuArr.forEach(menu => {
								if (!menu.isLeaf)
									folderArr.push(menu.id)
								if (this.menuMap.has(menu.parentId)) {
									this.menuMap.get(menu.parentId).push(menu)
								} else
									this.menuMap.set(menu.parentId, [menu])
							});
							setTimeout(() => {
								this.$refs.menuTree.expandAll(menuTreeRoot);
							}, 200)
							roleRefMenuList({
								Vue: this,
								params: {
									roleId: this.roleId,
									appId: appId
								}
							}).then(res => {
								if (res.result) {
									let roleRefMenu = res.model||[];
									if (roleRefMenu != null && roleRefMenu.length > 0) {
										let menuIds = [];
										roleRefMenu.forEach(item => {
											menuIds.push(item.menuId)
										});
										setTimeout(() => {
											this.$refs.menuTree.setCheckKeys(menuIds);
										}, 1000)
									}
								}
							});
						}
					}
				});
			},
			doClickHandler(index, option) {
				this.appId = option.value;
				this.loadAppMenu(option.value, option.label);
				this.loadRoleRefBtnList(this.selectedItems[0].value, option.value)
			}
		},
		components: {
			RoleTree,
			MenuTree,
			BtnList,
			AppGrantWin
		}
	}
</script>

<style>

</style>
