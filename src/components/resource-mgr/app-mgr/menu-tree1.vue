<!--
  规格配置
 -->

<template>
	<tree ref="tree" 
	:readOnly="true" 
	:showCheckbox="showCheckbox" 
	:props="props" 
	:defaultExpandedKeys="defaultExpandedKeys"
	:defaultCheckedKeys="defaultCheckedKeys"
	:rootData="rootData"  
	@loadNode="loadMenu" 
	@init="initTree" 
	@nodeChange="nodeChange" />
</template>

<script>
	export default {
		props: ['menuMap','showCheckbox','defaultExpandedKeys','defaultCheckedKeys'],
		data() {
			return {
				props: {
					id:'id',
					label: 'menuName',
					isLeaf: 'isLeaf'
				},
				rootData: [{
					menuName: '应用菜单',
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
			loadMenu(node, resolve, parentId) {
				if(this.menuMap!=null){
					resolve(this.menuMap.get(parentId))
				}else{
					resolve([])
				}
			},
			expandAll(node){
				this.$refs.tree.expandAll(node);
			},
			setCheckKeys(keys){
				this.$refs.tree.setCheckKeys(keys);
			},
			getCheckKeys(){
				return this.$refs.tree.getCheckKeys();
			},
			nodeChange(node, data) {
				this.currNode = node;
				this.$emit('nodeChange',node)
			},
			getCurrNode(){
				return this.currNode;
			},
			getRootNode(){
				return this.rootNode;
			}
		}
	}
</script>
<style lang="less">

</style>
