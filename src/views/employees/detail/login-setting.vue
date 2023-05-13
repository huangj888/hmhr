<template>
  <div class="login-setting">
    <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top: 30px">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateFn">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 网络请求->在逻辑页面(路由页面)里发送
// 当前3个组件, 是detail里一部分(而这三个组件以后也不会在别的项目里复用)
// 所以这3个组件只在这里配合detail使用
import { getUserPhotoAPI, updateEmployeesAPI } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', triggler: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', triggler: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取用户信息
    this.getUserInfoFn()
  },
  methods: {
    // 获取用户详情
    async getUserInfoFn() {
      // this.$route拿到的是当前路由页面的信息对象
      // 此组件嵌入在detail页面的, 所以是可以拿到detail页面路由信息对象的
      const res = await getUserPhotoAPI(this.$route.query.id)
      // console.log(res)
      // this.userInfo.username = res.data.username
      // this.userInfo.password = res.data.password
      this.userInfo = res.data
    },
    // 更新按钮
    updateFn() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          const res = await updateEmployeesAPI(this.userInfo)
          this.$message.success(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
