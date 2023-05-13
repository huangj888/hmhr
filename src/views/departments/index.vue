<template>
  <!-- 二级路由页面容器(右下角) -->
  <div class="departments-container">
    <!-- 内容容器(四周内边距) -->
    <div class="app-container">
      <!-- 卡片组件(身体和白色区域内边距) -->
      <el-card class="box-card">
        <!-- 卡片头部(虚线上面)
          vue之前的具名插槽使用的写法
          template v-slot:header
          tempalte #header
         -->
        <div slot="header" class="clearfix">
          <!-- tabs标签页导航
        el-tabs (父容器) -> 一行标签页导航
            属性:
            v-model对应vue变量(保存的是选中选项卡的name值)->初始值也会影响选项卡默认选中第几个
            事件:
            tab-click 选项卡点击触发此事件方法
            (原理: 我们组件内检测用户点击行为, 回调tab-click事件)

            el-tabs-pane (子) -> 每个标签页导航(选项卡)
            属性: lable -> 选项卡标题
            name -> 选项卡别名(标识, 默认值从'1'开始)
            标签夹着的是: tab导航切换时所属内容
         -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织架构" name="first" class="tab-pane">
              <!-- class="tab-pane"设置左右padding, 把内容往中间挤压 -->
              <!-- 使用 Layout 布局绘制头部区域
                最外层一行, 2列
                  el-row: type布局模式
                          justify两端对齐
                          align交叉轴排列方式(垂直方向居中)
               -->
              <!-- 头部 -->
              <el-row type="flex" justify="space-between" align="middle" class="department-header">
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">江苏传智播客教育科技股份有限公司</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- 列表
                只要有嵌套: 8成用的是递归组件(你想要感受下, 可以去看layout/sidebar/el-submenu)
                tree已经在里面封装好了, 所以我们只要把数据的结构弄成嵌套的, 标签自动嵌套
                数组套对象 (第一层"对象" -> 第一层节点(每"行"-最左边无缩进)) (节点->一行标签)
                * 如果有children就证明有缩进嵌套行节点(子)
                * 对象lable, 当前行的文字

                props是tree的配置项(具体看下面注释)
                @node-click: tree组件行的标签的点击事件(节点点击事件)

               知识点1:
                :叫动态属性: 它会把=右侧的东西看做表达式 记住:(加了冒号右边的就是表达式, 不加冒号右边就是字符串)
                表达式: 变量, 常量和运算符组成 (表达式在原地是有结果的)
                例如:   :a="0" a="0" (前者是数字0, 后者是字符串0)

                知识点2:
                记住: (标签上直接写属性, 但是没有值, 此属性接到的默认值true(布尔类型))
                如果非要写要注意字符串还是布尔类型

                node-key: 每个树节点(行标签), 用来作为唯一标识的属性(对象里指定字段值作为标识)，整棵树应该是唯一的 (对象里id字段的值, 来作为这行标签的唯一标识)
                default-expand-all: 是否默认展开所有节点 (true都展开, false不展开(默认不写是false))
                expand-on-click-node: 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
               -->
              <el-tree class="departments-tree" :data="treeData" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="true" @node-click="handleNodeClick">
                <!-- 默认插槽  并且使用内部的数据进行自定义模板的渲染
                  scope.data 所以直接key解构赋值变量也是data(对应数据对象)
                  插槽会应用到每行循环上(每次data对应不同的行, 数据对象)

                  问题: 前提:使w用插槽技术的时候, 想要在插槽具体标签位置, 拿到组件内给插槽绑定属性和值?
                  答案: v-slot="变量名"  (变量名的值: 就会收集slot占位标签身上属性和值形成对象)
                  例如: v-slot="scope" scope的值 组件内源码在slot占位标签身上属性名和值 { data: 行数据对象 }
                  el-table的时候, 作用域插槽, 那个table里面绑定的属性名row:行数据对象
                  具名叫default

                  现在scope变量值 { data: 行数据对象 }
                  知识点: v-slot: 可以简化成 #

                  还原写法1:
                  #default="{ data }" 写全了 v-slot:default="scope"
                  下面就取值的时候 scope.data.name

                  简化1: 把data值解构赋值从scope里快速取出
                  v-slot:default="{ data: data }"
                  v-slot:default="{ data }"

                  简化2: v-slot: 省略成#

                  具名插槽default(默认) 可以分配给 内slot标签无名的/有default名字的都可以分配
                  不写名字, 也能分配给slot标签无名的/有default名字的都可以分配
                 -->
                <template #default="{ data }">
                  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                              <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                              <el-dropdown-item v-if="data && !data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <!-- 新增-子部门-弹窗 -->
      <depart-dialog ref="departDialog" :dialog-visible.sync="dialogVisible" :employees-simple-list="employeesSimpleList" :origin-list="originList" :is-edit="isEdit" :click-depart-id="clickDepartId" @addDepartEV="addDepartFn" />
    </div>
  </div>
</template>

<script>
import {
  getDepartmentsListAPI,
  getEmployeesSimpleListAPI,
  addDepartmentsAPI,
  getDepartDetailAPI,
  updateDepartDetailAPI,
  delDepartAPI
} from '@/api'
import { transTree } from '@/utils'
import departDialog from './components/departDialog.vue'
export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
      // 树形控件数据
      treeData: [
        {
          departName: '总裁办',
          name: '孙财'
        },
        {
          departName: '行政部',
          name: '罗晓晓'
        },
        {
          departName: '人事部',
          name: '安小晴',
          children: [
            {
              departName: '财务核算部'
            }
          ]
        },
        {
          departName: '财务部',
          name: '',
          children: [
            {
              departName: '财务核算部'
            },
            {
              departName: '税务管理部'
            },
            {
              departName: '薪资管理部'
            }
          ]
        },
        {
          departName: '技术部',
          name: '',
          children: [
            {
              departName: '前端技术部'
            },
            {
              departName: '后端技术部'
            }
          ]
        },
        {
          departName: '运营部',
          name: ''
        },
        {
          departName: '市场部',
          name: '武高丽',
          children: [
            {
              departName: '市场部1'
            },
            {
              departName: '市场部2'
            }
          ]
        }
      ],
      // 定义结构显示
      defaultProps: {
        children: 'children', // children属性对应值, 要对应数据对象哪个字段(来决定行节点是否有嵌套的子节点数据)
        label: 'departName' // label属性对应值, 要对应数据对象里哪个字段(此对象字段值, 决定节点行标签显示的中文)
      },
      dialogVisible: false,
      employeesSimpleList: [], // 员工简单列表
      clickDepartId: '', // 点击那行部门的id
      isEdit: false, // 添加/编辑->部门状态(true编辑, false新增)
      originList: [] // 用于弹窗内-校验部门code和name是否重复数据数组
    }
  },
  created() {
    // 获取部门列表
    this.getDepartmentsListFn()
    // 获取员工简单列表
    this.getEmployeesSimpleListFn()
  },
  methods: {
    // 获取部门列表方法
    async getDepartmentsListFn() {
      const res = await getDepartmentsListAPI()
      // 把扁平的数组里对象, 映射一份只有关键4对key+value值对象, 形成一个新数组, 用于传入表单组件内做判断
      this.originList = res.data.depts.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        pid: item.pid // 下面使用
      }))
      // console.log(res)
      this.treeData = transTree(res.data.depts, '')
    },
    // 获取->员工简单列表
    async getEmployeesSimpleListFn() {
      const res = await getEmployeesSimpleListAPI()
      this.employeesSimpleList = res.data
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    handleNodeClick(data) {
      // console.log(data)
    },
    // 正文部分-右侧的添加子部门
    // 头部->添加子部门(data是undefined) (一级部门pid='')
    // 列表->添加子部门(data是一行对应的部门对象)->treeData里数据 (子部门pid=父id)
    add(data) {
      if (data === undefined) {
        this.clickDepartId = '' // 公司右侧点击, 保存id就是''
      } else {
        this.clickDepartId = data.id // 把点击行的部门id存入
      }
      // 理解: 子部门pid = 父(点击部门)id

      this.dialogVisible = true // 添加子部门dialog->出现
      this.isEdit = false
    },
    // 编辑子部门
    async edit(data) {
      this.clickDepartId = data.id // 编辑的部门id
      this.dialogVisible = true // 编辑和添加共用同一个dialog组件
      this.isEdit = true
      const res = await getDepartDetailAPI(data.id)
      // this.departDetailObj = res.data
      // this.$refs.departDialog -> 拿到departDialog.vue组件this的值(组件对象)
      this.$refs.departDialog.form = res.data
    },
    // 删除部分
    async del(data) {
      const res = await delDepartAPI(data.id)
      // 不用success判断, 因为在axios的响应拦截器里, 如果4xx/5xx的http状态码返回reject状态Promise对象, 你需要用try+catch捕获, await是拿不到也不往下执行的, 如果要success为false也无法向下
      // 保证await下面的代码肯定是成功才能执行
      // 删除成功, 提示一下, 再刷新列表
      this.$message.success(res.message)
      this.getDepartmentsListFn()
    },
    // 添加子部门->确定添加方法
    // 编辑部门->确定也走这里
    // formObj 是子传出来的值
    async addDepartFn(formObj) {
      if (this.isEdit) {
        // this.isEdit为true 编辑

        // formObj有7对key+value
        // 原因: 编辑的时候, 把子组件form变量重新赋予了一个新对象
        // 其他2个可以不传
        // console.log(formObj)
        await updateDepartDetailAPI(formObj)
      } else {
        // formObj默认接收的4对key+value
        formObj.pid = this.clickDepartId // formObj是要给后台的, 参数名要看接口为pid, 值是父级部门id(父级部门就是你点击行部门, 为了给它添加子部门)
        await addDepartmentsAPI(formObj)
        // 所以await只有成功了才往下走, 下面默认就写成功代码即可
      }
      // 添加/编辑完成, 刷新列表
      this.getDepartmentsListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-tree {
  margin: 12px 0px;
}
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
