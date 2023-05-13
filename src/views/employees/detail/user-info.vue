<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <!--
              数据 "2018-01-01" -> 影响视图显示
              视图选择 -> 默认绑定日期对象 -> v-model变量

              type="date" (选择年-月-日) 控制选择日期格式 (组件渲染内容)
              value-format 选择的值绑定格式(默认不写, v-model绑定的是日期对象)

             -->
            <el-date-picker v-model="userInfo.timeOfEntry" style="width: 300px" type="date" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <upload-img ref="uploadImg" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserPhotoAPI, updateEmployeesAPI } from '@/api'
import EmployeeEnum from '@/api/constant'

export default {
  data() {
    return {
      userInfo: {}, // 个人信息-对象(提前声明属性为了见名知意)
      EmployeeEnum
      // 知识点: v-model="userInfo.workNumber"
      // 当输入框有值的时候
      // 如果对象里有这个属性, 则赋值
      // 如果对象里无这个属性, 则会添加属性并赋值
    }
  },
  created() {
    // 请求-个人信息
    this.getUserInfoFn()
  },
  methods: {
    async getUserInfoFn() {
      const res = await getUserPhotoAPI(this.$route.query.id)
      this.userInfo = res.data
      this.$refs.uploadImg.imageUrl = res.data.staffPhoto
      // 额外加入一个聘用形式
      // 问题: 下面这样写, 为何点击页面下拉菜单, 标签里显示的值不变, vue里数据名里值变了
      // 问题: 视图 -> 数据(v), 但是数据 -> 响应没有更新给视图
      // Vue框架原理: 响应式原理
      // Vue内部会检测data里每个变量(如果变量本身改变了->上面那句话, 响应式更新视图所有)
      // 检测userInfo里每个属性(检测到变化, 会更新数据+视图)
      // 上面数据劫持已经绑定完毕

      // 走到这句话的时候, 数据->视图 (但是没有绑定数据劫持)
      // 给"对象后续添加一个属性"的时候, "还想双向绑定好用" 不会应该对象本身的响应式触发
      // this.userInfo.formOfEmployment = parseInt(this.$route.query.form)
      // 解决: 如果你要后续给对象添加属性
      // $set() Vue内部提供的一个专门添加数组/对象某个值的(并且额外添加数据劫持)
      // 参数1: 数组/对象 目标
      // 参数2: 下标/属性名
      // 参数3: 值
      this.$set(
        this.userInfo,
        'formOfEmployment',
        parseInt(this.$route.query.form)
      )
    },

    // 保存更新按钮->点击事件
    async saveUser() {
      // 把头像地址保存到userInfo里一起带给后台
      this.userInfo.staffPhoto = this.$refs.uploadImg.imageUrl

      const res = await updateEmployeesAPI(this.userInfo)
      this.$message.success(res.message)
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
.user-info {
  padding-top: 20px;
}
</style>
