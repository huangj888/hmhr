<template>
  <div>
    <!-- action: 上传地址(此属性必须写)
    show-file-list: 文件上传的列表(标签下出现已上传成功的文件名等) false不要
    on-success: 文件上传成功的钩子(回调右侧的函数执行, 组件内会给我们传值)
           前端->后端action地址(成功)
    before-upload: 文件上传之前的钩子 (函数内return false或者reject拒绝Promise对象)
    upload组件内就会停止往后端上传文件 (主要作用: 上传前的一个判断)

    http-request使用之后, 默认上传的内部ajax就不在执行
    action写了也没用了, 也不会执行on-success
   -->
    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="customRequestFn">
      <!-- 看imageUrl里有图片地址了, 就显示图片, 否则显示+号 -->
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <el-progress v-show="showProgress" type="circle" :percentage="percentage" class="progress" />
    </el-upload>
  </div>
</template>

<script>
// 明确目标: 找组件, 用组件, 读组件, 改组件
// 导入 cos 模块
const COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKID10wNl7Up8oS4a3TxjR9obRG37IWp1AFI',
  SecretKey: 'DOdqOwaDnNxXJ7vjYJ0fXPHEFKNPQS5g'
})
export default {
  name: 'UploadImg',
  data() {
    return {
      imageUrl: '', // 上传成功的图片地址(外链)
      showProgress: false, // 环形进度条
      percentage: 0 // 上传进度(0-100数字)
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // res: 后端返回的响应数据 (upload内部自带ajax请求, 不会走你request.js(axios))
      // file: 前端本地磁盘里, 上传到浏览器上, 的这个文件对象信息
      // Object URL Array Map Set 等等都是JS内置的对象(无需声明直接使用)
      // URL.createObjectURL()方法, 此方法会把文件数据, 转成blob:临时前端地址
      // 可以用于img临时加载此前端的文件在浏览器上img标签中显示
      // 文件 -> 图片本地临时地址

      // 知识点: img标签的src属性 (值: 图片的base64字符串, 外链地址, 相对地址, blob临时地址)
      // 知识点2: 想要做图片的预览
      //    思路1: 上传文件到服务器端, 让后端返回图片在服务器端外链地址, 加载给img标签src做图片预览 (必须上传成功)
      //    思路2: 纯前端(无需上传到服务器), 图片文件显示到页面上(URL.createObjectURL())
      // file.raw 是File类型的 文件对象(就是文件本身)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // upload上传图片到后台, 前的一个判断函数
    beforeAvatarUpload(file) {
      // file 本地上传到浏览器上文件对象
      // file.type 传递的这个文件类型 (值有几种固定格式, mime媒体类型)
      // 'image/jpeg' -> jpeg结尾的文件图片 'image/png' 以png结尾的图片...
      const isJPG = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif'
      ].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // upload自定义上传过程
    customRequestFn(obj) {
      this.showProgress = true
      // obj.file -> 本地上传到浏览器的 文件对象
      cos.putObject(
        {
          Bucket: 'huangjin-1318076378' /* 必须(存储桶名字) */,
          Region:
            'ap-nanjing' /* 存储桶所在地域，必须字段(存储桶所在地区的英文名) */,
          Key: obj.file
            .name /* 必须(图片本身的名字, 存储桶里面文件名-唯一标识) */,
          StorageClass: 'STANDARD', // 存储的类型(标准存储: STANDARD固定的)
          Body: obj.file, // 上传文件对象
          onProgress: progressData => {
            // progresData.percent -> 进度(0-1)数字
            this.percentage = parseInt(progressData.percent * 100)
          }
        },
        (err, data) => {
          console.log(err || data)
          this.imageUrl = 'http://' + data.Location // 注意外链必须是http://开头的
          setTimeout(() => {
            // 让进度条消失的慢点, 可以看到效果
            this.showProgress = false
          }, 1000)
        }
      )
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
