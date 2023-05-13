<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <loginSetting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 单标签: 此标签没有子标签, eslint代码检查, 做了约束(每个项目里eslintrc.js配置不同-规则不同)
import LoginSetting from './detail/login-setting'
import UserInfo from './detail/user-info'
import JobInfo from './detail/job-info'

export default {
  // 挂载子组件
  components: {
    LoginSetting,
    UserInfo,
    JobInfo
  }
}
</script>
<style lang="scss" scoped>
</style>
