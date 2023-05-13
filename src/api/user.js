import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} data 手机号+密码的数据对象
 * @returns Promise对象
 */
export function loginAPI(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    // headers: {} // axios默认会携带请求头Content-Type: 'application/json'
    // Content-Type: 'application/json' -> 请求体里参数名和值, 会变成JSON字符串格式给后台
    data: data
    // data: {
    //     mobile: data.mobile,
    //     password: data.password
    // }
  })
}

/**
 * 用户 - 获取用户资料
 * @description: 获取用户资料
 * @param {*}
 * @return {*}
 */
export function getUserProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * 获取用户基本信息
 * @returns Promise对象 (axios留下的)
 */
export function getProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 用户 - 获取头像
 * @description: 获取用户头像
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserPhotoAPI(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
