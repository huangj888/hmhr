<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermissionFn(1, '0')">添加权限</el-button>
        </div>

        <el-table border :data="allPermissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPermissionFn(2, row.id)">添加</el-button>
              <el-button type="text" @click="editPermissionFn(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermissionFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 添加权限点的弹框 -->
      <per-dialog ref="perDialog" :is-edit="isEdit" :permission-list="permissionList" @addPerEV="addPerFn" />
    </div>
  </div>
</template>

<script>
import {
  getPermissionListAPI,
  addPermissionAPI,
  getPermissionDetailAPI,
  updatePermissionAPI,
  delPermissionAPI
} from '@/api'
import { transTree } from '@/utils'
import perDialog from './components/perDialog.vue'
export default {
  components: {
    perDialog
  },
  data() {
    return {
      allPermissionList: [], // 所有权限点对象数组(树形的)
      permissionList: [], // 所有(扁平的)
      isEdit: false // 添加/编辑权限点
    }
  },
  created() {
    // 获取->所有权限点列表
    this.getPermissionListFn()
  },
  methods: {
    // 获取权限管理列表的数据
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      // transTree内部在查找的时候, 参数2, 要传递父级id(递归找子对象)
      this.permissionList = res.data
      // 目标: 为了让pid为'0'的对象, 在数组里第一层
      this.allPermissionList = transTree(res.data, '0')
    },
    // 点击添加->权限点弹窗出现
    // type: 右上角按钮传下来1, 页面权限点右侧添加, 传下来2 (type值作为新对象的type使用)
    // pid: 右上角按钮传下来'0', 页面权限点右侧添加点击, 传下来行id值 (pid也是要给新对象pid使用)
    addPermissionFn(type, pid) {
      this.$refs.perDialog.showDialog = true // 弹窗出现
      this.$refs.perDialog.formData.type = type
      this.$refs.perDialog.formData.pid = pid // 表单组件弹框里组件对象, 添加2个值 (其他4个表单里用户输入)
    },
    // 执行添加/编辑权限点逻辑
    async addPerFn(formData) {
      if (this.isEdit) {
        // 编辑
        await updatePermissionAPI(formData)
      } else {
        // 新增
        await addPermissionAPI(formData)
      }
      this.getPermissionListFn()
    },
    // 编辑权限点->点击事件
    async editPermissionFn(perId) {
      this.isEdit = true
      this.$refs.perDialog.showDialog = true // 共用一个弹窗, 出现
      const res = await getPermissionDetailAPI(perId)
      // console.log(res)
      this.$refs.perDialog.formData = res.data
    },
    // 删除权限点->点击事件
    async delPermissionFn(perId) {
      const res = await delPermissionAPI(perId)
      // 删除成功提示
      this.$message.success(res.message)
      this.getPermissionListFn()
    }
  }
}
</script>

<style lang="scss" scoped></style>
