<!--
  设备分组维护
 -->

<template>
	<toast :config="config" @cancel="config.dialogVisible=false" @doSave="doSave">
		<el-table :data="temList" :highlight-current-row="false" style="width: 90%;margin: 0px auto;">
			<el-table-column align="center" label="设备组" >
				<template slot-scope="scope">
					<el-input v-model="scope.row.alias" size="medium"></el-input>
				</template>
			</el-table-column>
			
			<el-table-column width="140" align="center" label="操作">
				<template slot-scope="scope">
					<el-button size="mini" icon="el-icon-plus" type="primary" @click="doAdd(scope.$index)"></el-button>
					<el-button size="mini" icon="el-icon-minus" @click="doDel(scope.$index)" type="danger"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</toast>

</template>

<script type="text/javascript">
	import {
	saveOrUpdateDevGroup
	} from '../../../api/safetymgr-macmgr.js'
	export default {
		data(){
				return {
					config: { //设备分组维护
						title: '设备组维护', //弹窗标题
						dialogVisible: false, //弹窗显示
						width: '600px', //弹窗宽
						tempList: [],
						emptyRow: {
							id: 0,
							alias: '',
							deleted: 'F'
						},
						btnData: [{
							isShow: true,
							disabled: false,
							name: '取消', //按钮名
							method: 'cancel', //回调函数
						}, {
							disabled: false,
							isShow: true,
							name: '确定', //按钮名
							method: 'doSave', //回调函数
						}]
					}
				}
		},
		computed:{
			temList(){
				return this.config.tempList.filter(item=>item.deleted==null||item.deleted=='F')
			}
		},
		methods: {
			show(dataList){
				if(dataList!=null&&dataList.length>0)
						this.config.tempList = [...dataList]
				else	
						this.config.tempList =[]
				this.config.tempList.push({...this.config.emptyRow});
				this.config.dialogVisible = true;
			},
			/**显示条数变化 */
			doAdd(index_) {
				this.config.tempList.splice(index_+1,0,{...this.config.emptyRow})
			},
			doDel(index_){
				let temp = this.config.tempList[index_];
				if(temp.id==null||temp.id==0)
					this.config.tempList.splice(index_,1)
				else
					this.$set(temp,'deleted','T')
			},
			doSave(){
				let temp ='';
				let hasError = false;
				let tempArr1=[]
				this.config.tempList.forEach((item, index) => {
					if (item.alias==undefined||item.alias=='undefined'||item.alias == '') {
						if (item.id && item.id > 0){
							item.deleted = 'T';
							tempArr.push(item)
						}
					}else{
						if(temp.indexOf("#"+item.alias+"#")>-1){
							 this.$message({
							  message: '第'+(index+1)+'行内容存在重复,请检查...',
							  type: 'warning'
							});
							hasError = true;
							return;
						}else{
							tempArr1.push(item)
							temp+="#"+item.alias+"#";
						}
					}
				})
				
				if(hasError==false){
						this.config.dialogVisible = false;
						this.$emit("doSave",tempArr1);
				}
				tempArr1.forEach(item=>{
					delete item.createTime
					delete item.modifyTime
					delete item.value
					delete item.label
				})
				console.log(tempArr1,'tempArr1')
				saveOrUpdateDevGroup({
					Vue: this,
					params: tempArr1
				}).then(res => {

				})
			}
		}
	};
</script>
<style>
	.pagetool {
		text-align: center;
	}
</style>