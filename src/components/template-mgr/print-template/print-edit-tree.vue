<template>
	<div>
		<tree ref="tree" :readOnly="false" :props="props" :rootData="rootData" :buttons="buttons" @loadNode="loadOrgList" @doAdd="doAdd"
		@doDel="doDel" @doMove="doMove" @nodeChange="nodeChange" @init="initTree"></tree>
		<org-choose-win ref="orgChooseWin" @callback="moveCallBack"/>
	</div>
</template>

<script>
	import {
		orgList,
		deleteOrg,
		moveOrg
	} from '../../../api/orgusermgr-orgmgr.js'
	import OrgChooseWin from './org-choose-win.vue'
	export default {
		data() {
			return {
				rootNode: null,
				currNode:null,
				props: {
					label: 'orgName',
					isLeaf: 'isLeaf'
				},
				buttons: [{
					icon: 'plus',
					method: 'doAdd'
				}, {
					icon: 'delete',
					method: 'doDel',
					isShowFun: (node) => {
						return node.data.id != 0;
					}
				}, {
					icon: 'sort',
					method: 'doMove',
					isShowFun: (node) => {
						return node.data.id != 0;
					}
				}],
				rootData: [{
					orgName: '所有部门',
					id: 0,
					isLeaf: false
				}]
			};
		},
		methods: {
			initTree(rootNode) {
				this.rootNode = rootNode
			},
			init() {
				let rootNode = this.rootNode.childNodes[0];
				this.$set(rootNode, 'expanded', false)
				this.$set(rootNode, 'isLeaf', false)
				this.$set(rootNode, 'loaded', false)
			},
			nodeChange(node, data) {
				this.$emit("doEdit", node, data);
			},
			doAdd(node, data) {
				this.$emit("doAdd", node, data);
			},
			loadOrgList(node, resolve, parentId) {
				orgList({
					Vue: this,
					params: {
						parentId: parentId
					}
				}).then(res => {
					if (res.result) {
						resolve(res.model);
					}
				})
				
			},
			doDel(node, data) {
				this.$confirm("您确认删除部门？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteOrg({
							Vue: this,
							params: {
								id: data.id
							}
						}).then(res => {
							if (res.result) {
								let parent = node.parent;
								parent.removeChild(node);
							}
						})
					})
			},
			doMove(node, data){
				this.currNode = node;
				this.$refs.orgChooseWin.show();
			},
			moveCallBack(targetNode){
				 this.$confirm('您确定将部门移动至选中项, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					moveOrg({
						Vue: this,
						params: {
							sourceOrgId: this.currNode.data.id,
							targetOrgId: targetNode.data.id
						}
					}).then(res => {
						if (res.result) {
							let parent = this.currNode.parent;
							parent.removeChild(this.currNode);
						}
					})
				}).catch(() => {
				          
				});
			}
		},
		components: {
			OrgChooseWin
		}
	}
</script>

<style>

</style>
