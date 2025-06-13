import request from '@/utils/request'

// 查询资产列表
export function listAsset(query) {
  return request({
    url: '/assets/info/list',
    method: 'get',
    params: query
  })
}

// 查询资产详细
export function getAsset(id) {
  return request({
    url: '/assets/info/' + id,
    method: 'get'
  })
}

// 新增资产
export function addAsset(data) {
  return request({
    url: '/assets/info',
    method: 'post',
    data: data
  })
}

// 修改资产
export function updateAsset(data) {
  return request({
    url: '/assets/info',
    method: 'put',
    data: data
  })
}

// 删除资产
export function delAsset(id) {
  return request({
    url: '/assets/info/' + id,
    method: 'delete'
  })
}

// 导出资产
export function exportAsset(query) {
  return request({
    url: '/assets/info/export',
    method: 'get',
    params: query
  })
}