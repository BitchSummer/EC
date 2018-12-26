<template>
	<!-- 查看弹出框 -->
	<toast :config="config" @cancel="config.dialogVisible=false;">
        <qyTable  
            :tableData="tableData"
            :tableConfig="tableConfig"
    ></qyTable>
	</toast>
	<!-- 查看弹出框 -->
</template>

<script>
import {
		permissionList
	} from '../../../api/grantmgr-usergrant.js'
export default {
    data(){
        return{
            config: {
                title: "权限清单", //弹窗标题
                dialogVisible: false, //弹窗显示
                width: "1200px", //弹窗宽
                btnData: [{
                        isShow: true,
                        name: "取消",
                        bgColor: "dialog-normal",
                        method: "cancel"
                    },
                ]
            },
            tableData:[

            ],
            tableConfig:{
                colConfig: [
                    {field: 'userName', label: '用户名', type: 'text', width: 180},
                    {field: "phone",label: '电话',type: 'text',width: 180},
                    {field: "email",label: '邮箱',type: 'text',width: 180},
                    {field: 'isAble', label: '是否启用', type: 'text', width: 180},
                    {field: 'ableTime', label: '启停时间', type: 'text', width: 180},
                    {field: 'remark', label: '备注', type: 'text', width: 240},
                ],
                isSelection: false,//是否可选
                isPage: true,//是否分页
                isOrder: true, // 序号
                currentSelectArr: [], //当前勾选的数据
                align: "center", //文本对齐方式
                total: 0,//列表数量
                pageSize: 20,
                pageNo: 1,
                loading: false,//加载状态
                isHigh: true// 是否高亮
                },
            }
    },
    methods: {
        show(id){
            permissionList({
                Vue:this,
                params:{
                    userGroupId:id
                }
            }).then(data=>{
                if(data.result){
                    this.tableData = data.model.items
                    this.tableConfig.total = data.model.numRows
                }
            })
            this.config.dialogVisible = true;
        },
    }
}
</script>

<style lang="less">
    
</style>