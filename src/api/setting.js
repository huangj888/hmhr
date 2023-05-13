// 导入axios实例
import request from '@/utils/request'

/**
 * 请求->所有角色列表
 * @param {*} params {page: 页码数, pagesize: 每页条数}
 * @returns Promise对象
 */
export function getRoleListAPI(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 根据->公司ID获取, 公司详情信息
 * @param {*} comanyId 公司ID
 * @returns Promise对象
 */
export function getCompanyInfoAPI(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

/**
 * 添加角色
 * @param {*} data { name: 角色名字, description: 角色描述 }
 * @returns Promise对象
 */
export function addRoleAPI(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 根据角色ID -> 获取角色详情
 * @param {*} roleId 角色ID值
 * @returns Promise对象
 */
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/sys/role/${roleId}`
  })
}

/**
 * 根据角色ID -> 更新角色
 * @param {*} roleObj 角色对象
 * @returns Promise对象
 */
export function updateRoleAPI(roleObj) {
  return request({
    url: `/sys/role/${roleObj.id}`,
    method: 'PUT',
    data: roleObj
  })
}

/**
 * 根据角色ID -> 删除角色
 * @param {*} roleId 角色ID
 * @returns Promise对象
 */
export function delRoleAPI(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'DELETE'
  })
}

/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPermAPI(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
