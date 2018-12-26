<!--
  规格配置
 -->

<template>
<!-- :rootData="rootData"   -->
<!-- :treeData="rootData"
@loadNode="loadMenu" 
	@init="initTree" 
	@nodeChange="nodeChange"
	@nodeLabelClicked="nodeLabelClicked" -->
	<qw-tree ref="tree" 
	:readOnly="true" 
	:showCheckbox="showCheckbox" 
	:props="props_tree" 
	:defaultExpandedKeys="defaultExpandedKeys"
	:defaultCheckedKeys="defaultCheckedKeys"
	
	:treeData="[{
		id:0,
		menuName:'暂无数据...',
		isLeaf: true,
		children:[
		]
	}]"		
	@loadNodeData="loadNodeData"/>
</template>

<script>
    import qwTree from "../../zhiyun-ui/tree_fix.vue";
	export default {
        components:{
            qwTree
        },
		props: ['menuMap','showCheckbox','defaultExpandedKeys','defaultCheckedKeys'],
		data() {
			return {
				props_tree: {
					id:'id',
					label: 'menuName',
                    isLeaf: 'isLeaf',
                    children:'children',
				},
				rootData: [{
					menuName: '应用菜单',
					id: 0,
					isLeaf: false
				}]
			};
		},
		methods: {
            loadNodeData(node){

			},
			// nodeLabelClicked(node){
			// 	this.$emit('nodeLabelClicked',node)
			// },
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
