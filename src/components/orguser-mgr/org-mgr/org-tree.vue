<template>
		<tree ref="tree" :readOnly="true" :props="props" :rootData="rootData"  @loadNode="loadOrgList" @init="initTree" @nodeChange="nodeChange" />
</template>

<script>
	import {
		orgList
	} from '../../../api/orgusermgr-orgmgr.js'
	export default {
		data() {
			return {
				rootNode: null,
				currNode:null,
				props: {
					label: 'orgName',
					isLeaf: 'isLeaf'
				},
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
				this.rootNode.childNodes[0].expand()
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
			nodeChange(node, data) {
				this.currNode = node;
				this.$emit('nodeChange',node)
			},
			getCurrNode(){
				return this.currNode;
			}
		}
	}
</script>

<style>

</style>
