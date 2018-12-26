<template>
	<div>
		<!--  @loadNode="loadRoleList"  -->
		<qwTree ref="tree" :readOnly="false" :props="props" :rootData="rootData" @nodeLabelClicked="nodeLabelClicked" :buttons="buttons" @loadNodeData="loadRoleList_" @doAdd="doAdd"
		@doDel="doDel" @doMove="doMove" @nodeChange="nodeChange" @init="initTree"></qwTree>
		<role-choose-win ref="orgChooseWin" @callback="moveCallBack"/>
	</div>
</template>

<script>
	import {
		roleList,
		deleteRole,
		moveRole
	} from '../../../api/grantmgr-rolemgr.js'
	import RoleChooseWin from './role-choose-win.vue'
	import qwTree from "../../../components/zhiyun-ui/tree_fix.vue"
	export default {
		data() {
			return {
				rootNode: null,
				currNode:null,
				props: {
					id:"id",
					label: 'alias',
					isLeaf: 'isLeaf',
					children: 'children',
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
					alias: '企业角色',
					id: 0,
					isLeaf: false
				}]
			};
		},
		mounted(){
			let tree = this.$refs.tree;
			if(tree){
				let node = tree.getNodeById(0);
				if(node){
					this.loadRoleList_(node);
				}
			}
		},
		methods: {
			initTree(rootNode) {
				return;
				// this.rootNode = rootNode
				// this.loadRoleList_(this.rootNode);
				// this.rootNode.childNodes[0].expand()
			},
			nodeLabelClicked(node){
				this.$emit("doEdit", node, node.data);
			},
			nodeChange(node, data) {
				this.$emit("doEdit", node, data);
			},
			doAdd(node, data) {
				this.$emit("doAdd", node, data);
			},
			loadRoleList_(node){
				node.loading = true;
				roleList({
					Vue: this,
					params: {
						parentId: node.data.id
					}
				}).then(res => {
					node.loading = false;
					if (res.result) {
						this.$set(node.data,'children',res.model);
						if(node.data.children.length>0){
							setTimeout(()=>{
								node.loaded = true;
								node.loading = false;
								node.expanded = true;
							},200)
						}
						// resolve(res.model);
					}
				},(e)=>{
					node.loading = false;
				})
			},
			// loadRoleList(node, resolve, parentId) {
			// 	roleList({
			// 		Vue: this,
			// 		params: {
			// 			parentId: parentId
			// 		}
			// 	}).then(res => {
			// 		if (res.result) {
			// 			resolve(res.model);
			// 		}
			// 	})
			// },
			doDel(node, data) {
				this.$confirm("您确认删除角色？", "系统提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteRole({
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
				if(targetNode.data.id==this.currNode.parent.data.id){
					this.$message.info(
						"当前操作无需移动节点"
					)
					return;
				}
				 this.$confirm('您确定将角色移动至选中项, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					moveRole({
						Vue: this,
						params: {
							id: this.currNode.data.id,
							targetId: targetNode.data.id
						}
					}).then(res => {
						if (res.result) {
							let parent = this.currNode.parent;
							parent.removeChild(this.currNode);
							if(targetNode.loaded){
								let childNodes = targetNode.childNodes;
								childNodes.forEach(node_ => {
									targetNode.removeChild(node_);
								});
								targetNode.loaded = false;
							}
							setTimeout(()=>{
								roleList({
									Vue: this,
									params: {
										parentId: targetNode.data.id
									}
								}).then(res => {
									if (res.result) {
										let tree = this.$refs['tree']
										if(tree){
											let node = tree.$refs['modelTree'].getNode(targetNode.data.id);
											if(node){
												node.expanded = true;
												node.loaded = true;
												this.$set(node.data,'children',res.model);
											}
										}
									}
								})
							},500)
						}
					})
				}).catch(() => {
				          
				});
			}
		},
		components: {
			RoleChooseWin,
			qwTree
		}
	}
</script>

<style>

</style>
