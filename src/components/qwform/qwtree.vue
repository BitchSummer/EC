<template>
<div>
 <el-tree
      :data="data5"
      :show-checkbox="false"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-input v-if="data.isEdit" @blur="nodeInputBlur(node,data)" v-model="data.label"></el-input>
        <span v-else @click="nodeClick(node,data)">{{ node.label }}</span>
        <span>
            <el-button :disabled="data.id==0||(data.children && (data.children.length>0))"
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            <i class="el-icon-minus"></i>
            </el-button>
            <el-button
            type="text"
            size="mini"
            :disabled="node.level==4"
            @click="() => append(data)">
            <i class="el-icon-plus"></i>
            </el-button>

            <el-button
            type="text"
            size="mini"
            :disabled="data.id==0"
            @click="() => edit(node, data)">
            <i class="el-icon-edit"></i>
            </el-button>
        </span>
      </span>
</el-tree>
     {{data5}}
</div>    
</template>
<script>
  let id = 1000;
  export default {
    data() {
      const data = [{
        id: 0,
        isEdit:false,
        label: '系统菜单',
    //     children: [{
    //       id: 4,
    //       isEdit:false,
    //       label: '二级 1-1',
    //       children: [{
    //         id: 9,
    //         isEdit:false,
    //         label: '三级 1-1-1'
    //       }, {
    //         id: 10,
    //         isEdit:false,
    //         label: '三级 1-1-2'
    //       }]
    //     }]
    //   }, {
    //     id: 2,
    //     isEdit:false,
    //     label: '一级 2',
    //     children: [{
    //       id: 5,
    //       isEdit:false,
    //       label: '二级 2-1'
    //     }, {
    //       id: 6,
    //       isEdit:false,
    //       label: '二级 2-2'
    //     }]
    //   }, {
    //     id: 3,
    //     isEdit:false,
    //     label: '一级 3',
    //     children: [{
    //       id: 7,
    //       isEdit:false,
    //       label: '二级 3-1'
    //     }, {
    //       id: 8,
    //       isEdit:false,
    //       label: '二级 3-2'
    //     }]
      }];
      return {
          curData:null,
          level:3,
        data4: JSON.parse(JSON.stringify(data)),
        data5: JSON.parse(JSON.stringify(data))
      }
    },

    methods: {
        nodeClick(node,data){
            console.log(node,data);
            if(data.id==0){
                return;
            }
            if(!this.curData||(this.curData.id==data.id)){
                data.isEdit=true;
                this.curData=data;
                return;
            }else{
                this.curData.isEdit=false;
                data.isEdit=true;
                this.curData=data;
                return;
            }
        },
        nodeInputBlur(node,data){
            if(data.label=="")data.label="选项"+data.id;
            this.curData.isEdit=false;
        },
        append(data) {
        const newChild = { id: id++,pid:data.id, isEdit:false, label: "选项" + id, children: [] };
        if (!data.children) {
            this.$set(data, 'children', []);
        }
        data.children.push(newChild);
        },
        setEditById(treeData,id){
        if(!treeData)return;
            for(var i=0;i<treeData.length;i++) {
                var td = treeData[i];
                if(td.id==id) {
                    td.isEdit=true;
                }else{
                    td.isEdit=false;
                }
                if(td.children&&td.children.length){
                    this.setEditById(td.children,id)
                }
            }
        },
        findByNodeId(treeData,id){
            if(!treeData)return;
            for(var i=0;i<treeData.length;i++) {
                var td = treeData[i];
                if(td.id==id) {
                    return td;
                }else{
                return this.deleteLocalDep(td.children, id);
            }
        }
        },
        deleteLocalDep(treeData,data){
        if(!treeData)return;
        for(var i=0;i<treeData.length;i++) {
            var td = treeData[i];
            if(td.id==data.id) {
                let temp=JSON.parse(JSON.stringify(treeData));
                temp.splice(i,1);
                treeData=temp;
            return;
            }else{
            this.deleteLocalDep(td.children, data);
            }
        }
        },
        edit(node,data){

        },
        remove(node, data) {           
            node.remove(data);
        //   console.log(this.data5,node,data);
        //   this.deleteLocalDep(this.data5,data);
        return;
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        },

        renderContent(h, { node, data, store }) {
        return (
            <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
                <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
                <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
            </span>);
        }
    }
  }
</script>

<style lang="less">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .el-input{
        width: auto;
        min-width: 80px;
    }
    .el-input__inner{
        height: 26px;
        line-height: 26px;
        border-radius: 0;       
        border: 1px solid #409EFF;
    }
    .el-input__inner:focus{
        border: 1px solid #409EFF;
    }
  }
</style>