<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option v-for="(item, index) in hireType" :key="index" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:50%" readonly placeholder="请选择部门" @focus="departmentNameFocus" />
      <div v-if="showTree" class="tree-box">
        <el-tree :data="treeData" default-expand-all :props="{ label: 'name' }" @node-click="treeClick" />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="addCancel">取消</el-button>
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Employees from '@/api/constant'
export default {
  name: 'EmpForm',
  props: {
    // 部门列表(树形结构)
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 添加表单字段
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 添加表单的校验字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      hireType: Employees.hireType, // 聘用形式枚举数组+对象
      showTree: false, // 是否显示树形组件
      clickDepartName: '' // 点击的部门名字
    }
  },
  watch: {
    // 检测-用户在页面修改后赋予的新值(newVal)
    // 检测-点击树形控件时, 给此对象属性赋值也会触发此函数
    // 检测-resetFields置空的时候也触发了
    'formData.departmentName'(newVal) {
      if (newVal.length === 0) {
        // 证明要置空
        return // 阻止代码往下执行
      }
      if (newVal !== this.clickDepartName) {
        // 证明用户在输入框修改
        this.formData.departmentName = this.clickDepartName // 立刻把用户改的, 覆盖掉
      }
    }
  },
  methods: {
    // 取消->点击事件
    addCancel() {
      this.$emit('update:show', false)
    },
    // 确定->点击事件
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 通过表单校验
          // 传值出去
          this.$emit('addEmpEV', { ...this.formData })
          // 关闭弹窗
          this.$emit('update:show', false)
        }
      })
    },
    departmentNameFocus() {
      this.showTree = true
    },
    // 部门树形控件->行点击事件
    // data: 点击那一行对应的数据对象
    // 折叠效果自带的, 写了return, 不想让下面隐藏tree组件的那句话执行
    // 效果: 你点击只看到折叠, 没有填充和隐藏
    treeClick(data) {
      // 如果当前部门还有子部门，则不能被选中
      if (data && data.children) {
        return // 你点击在了折叠的行上(回去吧)
      }
      // 把当前选中的节点显示在 input 框中
      this.formData.departmentName = data.name
      // 隐藏 tree
      this.showTree = false
      // 临时保存点击的部门名字
      this.clickDepartName = data.name
    }
  }
}
</script>

<style lang="scss" scoped></style>
