<template>
  <div class="modelTree fix">
    <div class="search">
        <el-input
            size="mini"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
        </el-input>
    </div>
    <el-tree
        ref="modelTree"
        empty-text="暂无相关数据,请先新增"
        :data="treeData"
        highlight-current
        node-key="id"
        :show-checkbox="showCheckbox"
        :props="props"
        :load="loadNode"
        @current-change="nodeChange"
	    lazy
        :filter-node-method="filterNode">
      <span class="custom-tree-node" :ref="'nodeLabel_'+ node.data.id" @click.stop="nodeLabelClicked(node)" slot-scope="{ node, data }">
        <span class="treeIcon" v-if="node.data.isLeaf==false" @click.stop="loadNodeData(node)"><i :class="node.loading? 'el-icon-loading':(node.expanded ? 'el-icon-caret-bottom':'el-icon-caret-right')"></i></span>
        <span class="text">{{ node.label }}</span>
        <span class="btns" v-if="readOnly==false" >
          <el-button
            v-for="(button,index) in buttons"
            :key="index"
            type="text"
            size="mini"
            v-if="button.isShowFun?button.isShowFun(node):true"
            :icon="'el-icon-'+button.icon"
            @click.stop="() => handlerClick(node,data,button.method)">
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<style  lang="less">
    .modelTree.fix{
        position: relative;
        .el-tree-node__loading-icon,.el-tree-node__expand-icon{
            display: none;
        }
        .treeIcon{
            display: inline-block;
            width: 20px;
            height: 20px;
            text-align: center;
            font-size: 16px;
            padding-right: 4px;
            line-height: 20px;
            color: #4099EF;
        }
        .search{
            margin-bottom: 15px;
        }
        .el-tree-node__content{
            height: 30px;
            line-height: 30px;
            box-sizing: border-box;
            margin-bottom: 5px;
            .custom-tree-node {
                display: flex;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                border: 1px solid #e2e4e6;
                padding-right: 8px;
                height: 30px;
                line-height: 30px;
                box-sizing: border-box;
                padding-left: 10px;
                .text{
                    flex: 1;
                    text-align: left;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .btns{
                    width: 100px;
                    text-align: right;
                }
                span{
                    font-size: 12px;
                }
            }
        }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
            background-color: #fff;
            &>.custom-tree-node{
                border: 1px solid #659ef4;
            }
        }
        .el-tree-node:focus>.el-tree-node__content, .el-tree-node__content:hover{
            background-color: #fff!important;
            &>.custom-tree-node{
                background-color: #f5f7fa;
            }
        }
    }   
</style>
<script>
// import {mapState} from 'vuex'
export default {
    data(){
        return{
            treeData: [{
                id:0,
                alias:"全部数据",
                children:[]
            }],
            filterText:'',
            initData:{}
        }
    },
    // props:['readOnly','param','props','buttons','rootData'],
    // computed:{
    //     ...mapState({
    //         ports:'ports',
    //     })
    // },
    props:{
    	readOnly:{
            type:Boolean,
            default:true,
        },
        showCheckbox:{
            type:Boolean,
            default:false,
        },
        props:{
        	type:Object,
        	default:{
        		label:'label'
        	}
        },
				
        defaultExpandedKeys:{
            type:Array,
            default:()=>{
                return []
            }
        },
        defaultCheckedKeys:{
            type:Array,
            default:()=>{
                return []
            }
        },
        buttons:{
        	type:Array,
        	default:()=>{
        		return []
        	}
        },
        rootData:{
        	type:Array,
        	default:()=>{
        		return []
        	}
        },
        isOpen:{
            type:Boolean,
            default:false,
        },
    },
    methods:{
        getNodeById(id){
            let tree = this.$refs.modelTree;
            if(tree){
                return tree.getNode(id);
            }else return null;
        },
        
        nodeLabelClicked(node){
           this.loadNodeData(node);
           setTimeout(()=>{
               this.$emit("nodeLabelClicked",node);
           },300) 
        },
        loadNodeData(node){
            if(node.loaded== true){
                node.expanded = !node.expanded;
                return;
            }else  this.$emit("loadNodeData",node);
        },
        handlerClick(node,data,method){
            this.$emit(method,node,data)
        },
        nodeChange(data,node){
            this.$emit('nodeChange',node,data)
        },
        filterNode(value, data) {
            if (!value) return true;
            return data[this.props.label].indexOf(value) !== -1;
        },
        expandAll(node){
            if(!node.isLeaf){
                if(!node.loaded){
                    node.expand();
                    setTimeout(()=>{
                        this.expandAll(node)
                    },100)
                }else{
                    node.childNodes.forEach(item=>{
                        this.expandAll(item)
                    })
                }
            }
        },
        setCheckKeys(keys){
            this.$refs.modelTree.setCheckedKeys(keys);
        },
        getCheckKeys(){
            this.$refs.modelTree.getCheckedKeys();
        },
				
        // 获取树节点数据
        // getTreeData(node,resolve,id){
        //     this.$http.post(
        //         this.ports+this.treeUrl,
        //         {
        //             parentId:id,
        //             modelType:node.data.modelType,
        //             ...this.param
        //         },
        //         {},
        //         data=>{
        //             resolve(data)
        //         },
        //         this
        //     )
        // },
        loadNode(node, resolve){
            if(node.level==0){
                if(this.rootData.length>0){
                    resolve(this.rootData)
                }else{
                    resolve([this.initData])
                }  
            }else{
            	this.$emit('loadNode',node,resolve,node.data.id)
            }
        }
    },
    created(){
        this.initData={
            id:0,
            isLeaf:false
        }
        this.$set(this.initData,this.props.label,'root')
    },
    mounted(){
        this.$emit('init',this.$refs.modelTree.root)
    },
    watch: {
        filterText(val) {
            this.$refs.modelTree.filter(val);
        }
    },
}
</script>
