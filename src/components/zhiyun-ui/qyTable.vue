:fixed="item.fixed" //列是否固定在左侧或者右侧
:prop="item.field" //对应列内容的字段名
:width="item.width" //对应列的宽度
:sortable="item.isSort" //排序
:resizable="item.isResize" //对应列是否可以通过拖动改变宽度
:show-overflow-tooltip="true" //当内容过长被隐藏时显示tooltip
:label="item.label" //标头标题
:align="tableConfig.align" //文本对齐方式
:disabled="item.disabled"//输入框禁用判断
<template>
  <div class="myTable">
    <!-- 交互按钮 -->
    <tool-bar v-if="tableConfig.toolbarConfig"
              @toolbarBack="toolbarBack"
              :toolbarConfig="tableConfig.toolbarConfig">
      <slot></slot>
    </tool-bar>
    <!-- 表格 -->
    <el-table :data="tableData"
              @select="select"
              @select-all="selectAll"
              @row-dblclick="rowDblclick"
              :height="tableConfig.height?tableConfig.height:560"
              :highlight-current-row="tableConfig.isHigh">
      <!-- 是否勾选 -->
      <el-table-column
        v-if="tableConfig.isSelection"
        type="selection"
        width="50"
        :selectable="selectable"
        :align="tableConfig.align"
        :disabled="tableData.length<0">
      </el-table-column>
      <el-table-column type="index" label="序号" v-if="tableConfig.isOrder" width="50"></el-table-column>
      <!-- 表格配置 -->
      <el-table-column v-for="(item,index,$index) in tableConfig.colConfig"
                       :fixed="item.fixed"
                       :prop="item.field"
                       :width="item.width"
                       :sortable="item.isSort"
                       :resizable="item.isResize"
                       :show-overflow-tooltip="!item.noTooltip"
                       :label="item.label"
                       :align="tableConfig.align"
      >
        <!-- 自定义表格内容 -->
        <template slot-scope="scope">
          <!-- 普通文本 -->
          <span v-if="item.type === 'text'">{{formatter(item.field,scope.row[item.field])}}</span>
          <!-- 输入框 -->
          <el-input v-else-if="item.type === 'input'" @blur="leaveBlur(scope.$index,scope.row[item.field],index)"
                    v-model="scope.row[item.field]" :disabled="item.disabled" size="mini"></el-input>
          <!-- 计数器 -->
          <el-input-number v-else-if="item.type === 'inputNumber'" v-model="scope.row[item.field]"
                           @change="inputNumberChange(scope.$index,scope.row[item.field],index)" :step="item.step"
                           :min="scope.row['minTax']" :max="scope.row['maxTax']" style="width:100%"
                           size="mini"></el-input-number>
          <!-- 定制计数器 -->
          <el-input-number  v-else-if="item.type === 'inputSpecialNum'" :precision="0" style="width:100%" size="mini" v-model="scope.row[item.field]" :controls="false" controls-position="right"
                            :step="1" :min="0"></el-input-number>
          <!--普通计数器-->
          <el-input-number v-else-if="item.type === 'inputNum'" v-model="scope.row[item.field]"
                           @change="inputNumChange(scope.$index,scope.row[item.field],index)" :step="item.step" :min="item.min"
                           :max="item.max" :precision="item.precision" style="width:100%" size="mini" controls-position="right"></el-input-number>
          <!-- 下拉菜单 -->
          <el-select v-else-if="item.type === 'select'" v-model="scope.row[item.field]" clearable placeholder="请选择"
                     size="mini">
            <el-option
              v-for="_item in scope.row['select_'+item.field]"
              :key="_item.value"
              :label="_item.label"
              :value="_item.value">
            </el-option>
          </el-select>
          <!-- 多个下拉菜单 -->
          <el-select v-else-if="item.type === 'selects'" v-for="list in item.lists" v-model="scope.row[list.field]"
                     :placeholder=list.placeholder size="mini" @change=list.method(scope.row[list.field],scope.row)>
            <el-option
              v-for="_item in list.options"
              :key="_item.value"
              :label="_item.label"
              :value="_item.value">
            </el-option>
          </el-select>
          <!-- 可输可选下拉菜单 -->
          <el-select v-else-if="item.type === 'filterSelect'" filterable
                     @change="filterChange(scope.$index,scope.row[item.field],index)" v-model="scope.row[item.field]"
                     placeholder="请选择" size="mini" :disabled="item.disabled" @focus="selectFocus(scope.$index,index)">
            <el-option
              v-for="_item in scope.row['select_'+item.field]"
              :key="_item.value"
              :label="_item.label"
              :value="_item.value">
            </el-option>
          </el-select>
                  <el-select v-else-if="item.type === 'filterSelect_'" filterable
                     @change="filterChange(scope.$index,scope.row[item.field],index)" v-model="scope.row[item.field]"
                     placeholder="请选择" size="mini" :disabled="item.disabled" @focus="selectFocus(scope.$index,index)">
            <el-option
              v-for="_item in item.children"
              :key="_item.value"
              :label="_item.label"
              :value="_item.value">
            </el-option>
          </el-select>
          <div v-else-if="item.type === 'selects_'">
          <span v-if="scope.row[item.field]&&scope.row['disabled']">{{scope.row[item.field]}}</span>
          <el-select  filterable v-else
                     @change="filterChange(scope.$index,scope.row[item.field],index)" v-model="scope.row[item.field]"
                     placeholder="请选择" size="mini" :disabled="scope.row['disabled']" @focus="selectFocus(scope.$index,index)">
            <el-option
              v-for="_item in scope.row['select_'+item.field]"
              :key="_item.value"
              :label="_item.label"
              :value="_item.value">
            </el-option>
          </el-select>
        
          </div>
          <!-- 日期选择 -->
          <el-date-picker v-model="scope.row[item.field]" v-else-if="item.type === 'date'" placeholder="选择日期"
                          size="mini" style="width:100%"  format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"></el-date-picker>
        <el-date-picker v-model="scope.row[item.field]" v-else-if="item.type === 'date1'" placeholder="选择日期"
                          size="mini" style="width:100%"></el-date-picker>
          <!--@blur="item.method"-->
          <!-- 一个操作 -->
          <el-button v-else-if="item.type === 'btnText'" type="text" size="mini"
                     @click=" buttonFunction(scope.row,scope.$index) ">{{item.field}}
          </el-button>
          <!--多个操作-->
          <div v-else-if="item.type === 'btnsText'">
            <el-button type="text" v-for="it in item.fields" @click="callBack(it.method,scope.row,scope.$index)"
                       size="mini">
              <!--<span v-if=""></span>-->
              {{it.name}}
            </el-button>
          </div>
          <!--审批按钮-->
          <div v-else-if="item.type === 'btnsApprove'">
            <el-button v-if="scope.row.isFinished == 'AS001' || scope.row.isFinished == 'AS003'" type="text" size="mini"
                       @click=" buttonFunction(scope.row,scope.$index) ">查看
            </el-button>
            <el-button v-else type="text" size="mini" @click=" buttonFunction(scope.row,scope.$index) ">审批</el-button>
          </div>
          <!-- 单选框 -->
          <el-checkbox v-else-if="item.type === 'checkbox'" v-model="scope.row[item.field]" :disabled="item.disabled">
            {{item.label}}
          </el-checkbox>
          <!--分开审批按钮-->
          <div v-else-if="item.type === 'separApprove'">
            <el-button v-if="scope.row.isFinished == 'AS001' || scope.row.isFinished == 'AS003'" type="text" size="mini"
                       @click="separApproveBtn(scope.row,scope.$index) ">查看
            </el-button>
            <el-button v-else type="text" size="mini" @click=" separApproveBtn(scope.row,scope.$index) ">审批</el-button>
          </div>
          <!--是否有删除按钮-->
          <div v-else-if="item.type === 'ifDelete'">
            <el-button v-if="scope.row.flag != true" type="text" size="mini">
            </el-button>
            <el-button v-else type="text" size="mini" @click="callBack(item.method,scope.row,scope.$index) ">删除</el-button>
          </div>
          <!--text或者select-->
          <div v-else-if="item.type === 'textOrSelet'">
            <el-select v-if="scope.row.flag == true" v-model="scope.row[item.field]" filterable  placeholder="请选择"
                       size="mini" @change="filterChange(scope.$index,scope.row[item.field],index)">
              <el-option
                v-for="_item in scope.row['select_'+item.field]"
                :key="_item.value"
                :label="_item.label"
                :value="_item.value">
              </el-option>
            </el-select>
            <!-- 普通文本 -->
            <span v-else>{{formatter(item.field,scope.row[item.field])}}</span>
          </div>
          <!--text或者number-->
          <div v-else-if="item.type === 'ifNumber'">
            <!-- 普通文本 -->
            <span v-if="scope.row.flag != true">{{formatter(item.field,scope.row[item.field])}}</span>
            <!--普通计数器-->
            <el-input-number v-else v-model="scope.row[item.field]"
                             @change="inputNumChange(scope.$index,scope.row[item.field],index)" :min="item.min"
                             :max="999999999" :precision="item.precision" style="width:100%" size="mini" controls-position="right"></el-input-number>
          </div>
          <!-- 未完待续 -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="my-pagination">
      <el-pagination v-if="tableConfig.isPage"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="tableConfig.pageNo"
                     :page-sizes="[20, 40, 60, 80]"
                     :page-size="tableConfig.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="tableConfig.total">
      </el-pagination>
    </div>
    <!-- loading -->
    <!--<loading v-show="tableConfig.loadShow"></loading>-->
  </div>
</template>


<script>
  import toolBar from './toolbar'

  export default {
    props: ["tableConfig", "tableData"],
    components: {toolBar},
    data() {
      return {
        // tableConfig:{
        //   toolbarConfig:[{//操作按钮配置
        //           loading:true,
        //           icon:'xxx',
        //           disabled:true,
        //           method:'xxxx',
        //           name:'小黑'
        //     }],
        //     //表格字段配置
        //     colConfig:[ { field: "voucherId", label: "出库单号", type: "input"},
        //                 { field: "inDate", label: "出库日期", type: "select"},
        //                 { field: "empName", label: "出库登记人", type: "text" },
        //                 { field: "remark", label: "备注", type: "text" }],
        //     isSelection:true,//是否可选
        //     isPage:true,//是否分页
        //     isFormatter:false,
        //     currentSelectArr:[],//当前勾选的数据
        //     align:'center',//文本对齐方式
        //     pageNo:1,
        //     pageSize:20,
        //     total:100,
        //     isHigh:false,
        //     isLoading:false,//是否开启loading
        //     loadShow:false,//loading控制
        //      },
        //     tableData:[{voucherId:'xxxx',inDate:'20152520',empName:'xxxxas',remark:'xxxasda',selectData:[{value:'xxx0',label:'xxx'},{value:'xxx0',label:'xxx'}]},
        //                {voucherId:'xxxx',inDate:'20152520',empName:'xxxxas',remark:'xxxasda'},{voucherId:'xxxx',inDate:'20152520',empName:'xxxxas',remark:'xxxasda'}]
      }
    },
    methods: {
      callBack(method, val, index) {
        this.$emit(method, val, index);
      },
      // 自定义列内容
      formatter(field, cellValue) {
        if (this.tableConfig.isFormatter) {
          let val = null;
          this.$emit("formatter", field, cellValue, value => {
            val = value;
          });
          return val;
        } else {
          return cellValue;
        }
      },
      toolbarBack(data) {//操作按钮回调
        this.$emit(data.method, data.index);
      },
      handleSizeChange(val) {//每页数量变化
        if (this.tableConfig.isLoading) {
          this.tableConfig.loadShow = true;//加载
        }
        this.tableConfig.pageSize = val;
        this.$emit("sizeChange");
      },
      handleCurrentChange(val) {//页码变化
        if (this.tableConfig.isLoading) {
          this.tableConfig.loadShow = true;//加载
        }
        this.tableConfig.pageNo = val;
        this.$emit("pageChange");
      },
      select(val) {//表格Checkbox勾选触发
        this.tableConfig.currentSelectArr = val;
      },
      selectAll(val) {//表格Checkbox全选触发
        this.tableConfig.currentSelectArr = val;
      },
      selectable(row, index) {//表格Checkbox是否可勾选
        if (this.tableConfig.selectable) {
          if (row[this.tableConfig.disabledField] == this.tableConfig.field) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      },
      rowDblclick(val) {//表格单行双击
        this.$emit('rowDblclick', val);
      },
      buttonFunction(row, index) {//查看详情操作
        this.$emit("buttonFunction", row, index);
      },
      filterChange(index, val, $index) {//下拉可选
        this.$emit('filterChange', index, val, $index);
      },
      leaveBlur(index, val, $index) {//失去焦点触发事件
        this.$emit('leaveBlur', index, val, $index);
      },
      inputNumberChange(index, val, $index) {//计数器事件
        this.$emit('inputNumberChange', index, val, $index);
      },
      selectFocus(index, $index) {
        if ($index != 0) {
          this.$emit('selectFocus', index, $index);
        }
      },
      inputNumChange(index, val, $index) {//普通计数器事件
        this.$emit('inputNumChange', index, val, $index);
      },
      //审批或查看
      approve(index, val) {
        this.$emit('approve', index, val);
      },
      separApproveBtn(val, index) {
        this.$emit('separApproveBtn', index, val);
      },
      //查看记录
      processRecord(index, val) {
        this.$emit('processRecord', index, val);
      }
    },
    watch: {
      'tableData': function () {
        this.tableConfig.currentSelectArr = [];
      }
    }
  };
</script>
<style lang="less">
  @colPading: 8px 0;
  @theadColor: #333333;
  @theadImage: linear-gradient(to right, #DEE3E8, #DEE3E8);
  .myTable {
    position: relative;
    .my-pagination {
      text-align: center;
      margin-top: 10px;
    }
    .el-table td {
      padding: @colPading;
    }
    .el-table thead {
      color: @theadColor;
      font-weight: 500;
      background-image: @theadImage;
      // background-color: #DEE3E8;
    }
    .el-table th, .el-table tr {
      background-color: rgba(0, 0, 0, 0);
    }
    .cell {
      box-sizing: border-box;
      white-space: normal;
      word-break: break-all;
      line-height: 23px;
      .el-cascader__label {
        width: 100px;
        height: 30px;
        border: 1px solid #DADADA;
        border-radius: 0;
        color: #0C68F1;
        margin-right: 10px;
        padding: 8px;
        line-height: 1;
      }
      .el-input--mini .el-input__icon {
        padding-right: 8px;
      }
      .el-icon-arrow-down:before {
        color: #0C68F1;
      }
    }
  }
</style>

