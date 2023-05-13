import request from '@/utils/request'

/**
 * 组织架构 - 获取列表
 * @returns Promise对象
 */
export function getDepartmentsListAPI() {
  return request({
    url: '/company/department'
  })
}

/**
 * 获取-员工简单列表(只有名字和员工id)
 * @returns Promise对象
 */
export function getEmployeesSimpleListAPI() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 组织架构 - 新增子部门
 * @description: 新增子部门
 * @param {object} data 发送参数： name, code, manager, introduce, pid
 * @param {object} data 发送参数： 部门名称, 部门编码, 部门管理者, 部门介绍, 新增的这个子部门的上级部门
 * @returns
 */
export function addDepartmentsAPI(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    // params: {} // 里面的参数和值会出现在url?后面
    // data: {} // 里面的参数名和值会出现在请求体body中
    data // 前端form表单的参数名, 直接和接口的对应, 这里可以少写很多属性名代码
  })
}

/**
 * 组织架构 - 获取部门详情
 * @description: 获取部门详情
 * @param {*} id 表示当前要编辑项的id值(部门id)
 * @return {*}
 */
export function getDepartDetailAPI(departId) {
  return request({
    url: `/company/department/${departId}`
  })
}

/**
 * 组织架构 - 更新部门详情
  * @description: 更新部门数据
  * @param {*} data: form表单数据 但是要有id, 父级的频道id。 9对key+value参数和值对象
  * @return {*}Promise对象
  */
export function updateDepartDetailAPI(dataObj) {
  return request({
    url: `/company/department/${dataObj.id}`,
    method: 'PUT',
    data: dataObj
  })
}

/**
 * 组织架构 - 删除部门
 * @description: 删除部门 - 注意: 有子部门不能删除
 * @param {*} departId 当前点击的操作按钮 所在的项的ID(部门ID)
 * @return {*}
 */
export function delDepartAPI(departId) {
  return request({
    url: `/company/department/${departId}`,
    method: 'DELETE'
  })
}
