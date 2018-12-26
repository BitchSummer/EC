<template>
	<div>
		<el-table height="400" border stripe ref="table" :data="tableData" style="width: 100%">
			<el-table-column type="index" width="35" />
			<el-table-column resizable align="center" label="参数类型" width="100">
				<template slot-scope="scope">
					<el-select v-model="scope.row.paramType" placeholder="请选择" size="small">
						<el-option
							v-for="item in paramTypeOp"
							:key="item"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column resizable align="center" label="参数名/值">
				<template slot-scope="scope">
 			    <el-select v-show="scope.row.paramType=='参数值'" v-model="scope.row.paramLabel" placeholder="请选择" size="small" @change="changeConfig">
						<el-option
							v-for="arr in paramLabelList"
							:key="arr.id"
							:label="arr.paramLabel"
							:value="arr.paramLabel">
						</el-option>
					</el-select> 			
					<el-input v-show="scope.row.paramType=='固定值'" v-model="scope.row.paramValue" size="medium"></el-input> 
					<el-input v-show="scope.row.paramType=='流水号'" v-model="scope.row.paramValue" size="medium"></el-input> 
				<!-- 	<el-input v-model="scope.row.paramValue" size="medium"></el-input> -->
				</template>
			</el-table-column>
			<el-table-column resizable align="center" label="参数长度" width="150">
				<template slot-scope="scope">
					<el-input-number v-model="scope.row.valueLen" :min="1" :max="20" :precision="0" :controls="false" size="small"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column resizable align="center" label="补零策略" width="200">
				<template slot-scope="scope">
					<el-select v-model="scope.row.fillZero" placeholder="请选择" size="small">
						<el-option
							v-for="item in fillZeroOp"
							:key="item"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column resizable align="center" label="排序号" width="120">
				<template slot-scope="scope">
					<el-input-number v-model="scope.row.orders" :min="1" :max="20" :precision="0" :controls="false" size="small"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column resizable align="center" label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="mini" icon="el-icon-plus" type="primary" @click="doAdd(scope.$index)"></el-button>
					<el-button size="mini" icon="el-icon-minus" @click="doDel(scope.$index)" type="danger"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	import { templateConfigList,saveOrupdate } from '../../../api/templatemgr-coderule.js'
	import bus from './eventBus.js'
	export default {
	  	props: ['paramLabelList'],  
		data() {
			return {
				ad:'',
				id:'',
				disabled:true,
				editModel:false,
				tableData: [],
				paramTypeOp: ['固定值', '参数值','流水号'],
				fillZeroOp:['前补零','后补零'],
				emptyRow:{
					paramType:'参数值',
					fillZero:'前补零',
					deleted:'F'
				}
			}
		},
		methods: {	
  			changeConfig(row){
			  let index=this.paramLabelList.findIndex(val=>val.paramLabel==row)
			  this.id=this.paramLabelList[index].id
			},  
 		doSave(){
 				for(let item in this.tableData){
				this.$set(this.tableData[item],'ruleId',this.ruleId)
				this.$set(this.tableData[item],'paramId',this.id) 
				delete this.tableData[item].createTime
				delete this.tableData[item].modifyTime
				delete this.tableData[item].paramLabel
				delete this.tableData[item].param
				 }
				 let param =this.tableData
					saveOrupdate({
						Vue: this,
						params: param
					}).then(res => {
					if (res.result){
				}	
			})
			}, 
			doConfig(){
				this.tableData.push({...this.emptyRow})
				this.editModel=true
			},
			/**显示条数变化 */
			doAdd(index_) {
				this.tableData.splice(index_ + 1, 0, { ...this.emptyRow
				})
			},
			doDel(index_) {
				let temp = this.tableData[index_];
				this.ad=temp.id
				if (temp.id == null || temp.id == 0)
					this.tableData.splice(index_, 1)
				else
				    this.tableData.splice(index_, 1)
					this.$set(temp, 'deleted', 'T')
			},
			doSearch(ruleId) {
				templateConfigList({
					Vue: this,
					params: {
						ruleId: ruleId
					}
				}).then(res => {
					if (res.result) {
						this.tableData = res.model;
					}
				})
			}
		}
	}
</script>
<style lang="less">

</style>
