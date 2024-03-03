import axios from './request.js'

// 问题录入/修改
export const addIssue = data => {
  return axios.request({
    url: '/api/addIssue',
    data,
    method: 'post'
  })
}

// 问题删除
export const delIssue = params => {
  return axios.request({
    url: '/api/delIssue',
    params,
    method: 'get'
  })
}

// 问题查询
export const queryIssue = params => {
  return axios.request({
    url: '/api/queryIssue',
    params,
    method: 'get'
  })
}

// 提交答案及返回正确答案
export const submitAnswer = data => {
  return axios.request({
    url: '/api/submitAnswer',
    data,
    method: 'post'
  })
}

// 新增用户
export const addUser = params => {
  return axios.request({
    url: '/api/addUser',
    params,
    method: 'get'
  })
}

// 删除用户
export const delUser = params => {
  return axios.request({
    url: '/api/delUser',
    params,
    method: 'get'
  })
}

// 所有成员成绩查询
export const queryPeople = params => {
  return axios.request({
    url: '/api/queryPeople',
    params,
    method: 'get'
  })
}
