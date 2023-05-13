<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="isEdit ? '编辑权限点' : '新增权限点'" :visible.sync="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="enterFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 添加/编辑状态
    isEdit: {
      type: Boolean,
      default: false
    },
    // 所有权限点列表(扁平)
    permissionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // 校验权限名称
    const validaName = (rule, value, callback) => {
      // formData.pid (新增的对象pid), 通过它找同级权限点对象
      let nameList = this.permissionList
        .filter(item => item.pid === this.formData.pid)
        .map(item => item.name)
      // 编辑状态
      if (this.isEdit) {
        nameList = this.permissionList
          .filter(
            item =>
              item.pid === this.formData.pid && item.id !== this.formData.id
          )
          .map(item => item.name)
      }
      nameList.includes(value)
        ? callback(new Error(`权限名字 ${value} 已经存在`))
        : callback()
    }

    // 校验权限标识
    const validaCode = (rule, value, callback) => {
      let codeList = this.permissionList.map(item => item.code)

      if (this.isEdit) {
        codeList = this.permissionList
          .filter(item => item.id !== this.formData.id)
          .map(item => item.code)
      }
      codeList.includes(value)
        ? callback(new Error(`权限标识 ${value} 已经存在`))
        : callback()
    }
    return {
      showDialog: false, // 控制dialog显示/隐藏
      // permissionList: [], // 权限管理列表数据
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型吖
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validaName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validaCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 关闭弹框
    btnCancel() {
      // 问题: 先编辑, formData里很多key+value(包含id和_id值)
      // 你再点击新增, 输入框的值只会改变formData里name等
      // formData对象里还有id和_id, 调用新增接口给后台
      // 导致后台id重复从而导致后台报错

      // 下面这个置空, 它只会影响标签里使用的相关的v-model属性值
      // id和_id的值还在(点击新增network里)
      this.$refs.perForm.resetFields()

      // 还需要自行清空
      // 拿到上面data选项, 再次调用data函数, 返回带初始值的对象
      // 给组件运行时的formData变量, 冲掉
      this.formData = this.$options.data().formData
    },
    // 确定按钮->点击事件
    enterFn() {
      // 验证用户是否输入了必填项
      this.$refs.perForm.validate(async valid => {
        if (valid) {
          this.$emit('addPerEV', { ...this.formData })
          // 防止一会儿做清空, 把formData对象引用的值清除了, axios发送的时候值为空
          // 把对象里的6对key+value值拷贝成一个新对象(清空formData不影响传出去给axios用的那个新对象了)
          this.showDialog = false
        }
      })
    },
    // 取消按钮->点击事件
    cancelFn() {
      this.showDialog = false
    }
  }
}
</script>
