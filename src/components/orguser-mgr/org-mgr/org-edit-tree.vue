<template>
	<div>
		<qwTree ref="tree" :readOnly="false" :props="props" :rootData="rootData" :buttons="buttons" @loadNodeData="loadOrgList" @doAdd="doAdd"
		@doDel="doDel" @doMove="doMove" @nodeChange="nodeChange" @init="initTree"></qwTree>
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
	import qwTree from "../../../components/zhiyun-ui/tree_fix.vue"
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
		mounted(){
			let tree = this.$refs.tree;
			if(tree){
				let node = tree.getNodeById(0);
				if(node){
					this.loadOrgList(node);
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
			nodeChange(node, data) {
				this.$emit("doEdit", node, data);
			},
			doAdd(node, data) {
				this.$emit("doAdd", node, data);
			},
			loadOrgList(node){
				node.loading = true;
				orgList({
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
		/* 	loadOrgList(node, resolve, parentId) {
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
			}, */
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
							console.log(parent.data,'ppppppppppp')
							parent.removeChild(this.currNode);
						/* 	for(let arr in parent.data.children)
							{
								if(parent.data.children[arr].id==this.currNode.data.id){
                                 parent.data.children.splice(arr,1)
								} */
								let tree = this.$refs['tree']
								tree.$refs['modelTree'].remove(this.currNode.data.id)
							/* } */
							/* parent.removeChild(this.currNode);  */ 
				setTimeout(()=>{  
							if(targetNode.loaded){
								let childNodes = targetNode.childNodes;
								childNodes.forEach(node_ => {
								targetNode.removeChild(node_);
								});
								targetNode.loaded = false;
							}
							
								orgList({
									Vue: this,
									params: {
										parentId: targetNode.data.id
									}
								}).then(res => {
									if (res.result) {
									/* 	let tree = this.$refs['tree'] */
										if(tree){
											let node = tree.$refs['modelTree'].getNode(targetNode.data.id);
											if(node){
												node.expanded = true;
												node.loaded = true;
												node.data.isLeaf=false
												this.$set(node.data,'children',res.model);
											}
										}
									}
								})
								
					 	},1500)  
						}
					})
				}).catch(() => {
				          
				});
			}
		},
		components: {
			OrgChooseWin,
			qwTree
		}
	}
</script>

<style>

</style>
