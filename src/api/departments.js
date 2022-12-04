import request from '@/utils/request'

// 获取组织架构页面的数据
export function getDepartments() {
  return request({
    url: '/company/department',
  })
}
// 根据id删除结点数据
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}