import request from '@/utils/request'

// 查询地址列表
export function listAssetAddr(query) {
  return request({
    url: '/assets/addr/list',
    method: 'get',
    params: query
  })
}

// 查询树形结构数据
export function getTreeData() {
  return request({
    url: '/assets/addr/tree',
    method: 'get'
  })
}

// 查询地址详细
export function getAssetAddr(addrid) {
  return request({
    url: '/assets/addr/' + addrid,
    method: 'get'
  })
}

// 新增地址
export function addAssetAddr(data) {
  return request({
    url: '/assets/addr',
    method: 'post',
    data: data
  })
}

// 修改地址
export function updateAssetAddr(data) {
  return request({
    url: '/assets/addr',
    method: 'put',
    data: data
  })
}

// 删除地址
export function delAssetAddr(addrid) {
  return request({
    url: '/assets/addr/' + addrid,
    method: 'delete'
  })
} 