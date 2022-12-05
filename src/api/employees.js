import request from '@/utils/request'

// 获取员工列表数据
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}