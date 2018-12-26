<template>
	<el-row :gutter="10" class="market-mgr">
		<el-col :span="8">
			<el-card>
				<print-edit-tree @doAdd="doAdd" @doEdit="doEdit"/>
			</el-card>
		</el-col>
		<el-col :span="16">
			<el-card>
				<h1>模版概况</h1>
				<el-form ref="form" class="rbox-form" size="small" :rules="rules" :model="form" label-width="90px">
					<el-row>
					    <el-col :span="8" :offset="0">
							<el-form-item label="模版编码:" prop="code">
								<el-input :disabled="!editModel" v-model="form.code"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8" :offset="0">
                            <el-form-item label="模版名称:" prop="name">
								<el-input :disabled="!editModel" v-model="form.name"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8" :offset="0">
                            <el-form-item label="启停标识:">
								<el-tag type="success" v-show="form.isAble=='已启用'">{{form.isAble}}</el-tag>
								<el-tag type="danger" v-show="form.isAble=='已停用'">{{form.isAble}}</el-tag>
							</el-form-item>
						</el-col>
			   	    </el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item label="创建时间">
								<el-date-picker disabled v-model="form.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择日期时间">
								</el-date-picker>
							</el-form-item>
						</el-col>
					    <el-col :span="8">
							<el-form-item label="修改时间">
									<el-date-picker disabled v-model="form.modifyTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
										placeholder="选择日期时间">
									</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="启停时间:">
								<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择日期时间">
								</el-date-picker>
							</el-form-item>
						</el-col>
			   	    </el-row>
				</el-form>
				<h1>参数事例</h1>
				<span>5555555555555555555555</span>
			</el-card>
			<el-card style="margin-top:10px;">
				<h1>打印模版</h1>
				<span style="margin-left:45px;">645465</span>
			</el-card>
		</el-col>
		<attr-maintain :config="maintainWinConfig" @doSave="doAttrSure"></attr-maintain>
	</el-row>
</template>
<script>
    import PrintEditTree from './print-edit-tree.vue'
	export default {
		props: ['form','editModel'],
		data(){
			return {
				rules:{ //校验
					code: [{
						required: true,
						message: '请输入模版编码...',
						trigger: 'blur'
					}], //模版编码
					name: [{
						required: true,
						message: '请输入模版名称...',
						trigger: 'blur'
					}] //模版名称
				},
				maintainWinConfig: {
					title: '姓名', //弹窗标题
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
		methods:{
			doAdd(node, data){
			
			},
			doEdit(node, data){
			
			},
			doAttrMaintain(){
				if(this.form.classList==null){
						this.maintainWinConfig.tempList =[];
				}else{
					this.maintainWinConfig.tempList = JSON.parse(JSON.stringify(this.form.classList))
				}
	
				this.maintainWinConfig.tempList.push({ ...this.maintainWinConfig.emptyRow
				})
				this.maintainWinConfig.dialogVisible = true
			},
			doAttrSure(tempArr){
					this.form.classList = tempArr
			}
		},
		components:{
			PrintEditTree,
		}
	}
</script>
<style lang="less">
	.market-mgr{
		h1{
			line-height: 40px;
		}
		.el-tag{
			margin: 5px;
		}
		.el-input.is-disabled .el-input__inner {
			width: 171px;
		}
	}
	
</style>
