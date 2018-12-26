<template>
		<tree ref="tree" :readOnly="true" :props="props" :rootData="rootData"  @loadNode="loadOrgList" @init="initTree" @nodeChange="nodeChange" />
	
</template>

<script>
	import {
		roleList
	} from '../../../api/grantmgr-rolemgr.js'
	export default {
		data() {
			return {
				rootNode: null,
				currNode:null,
				props: {
					label: 'alias',
					isLeaf: 'isLeaf'
				},
				rootData: [{
					alias: '企业角色',
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
				roleList({
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
