import {addIssue, delIssue, queryIssue, submitAnswer, addUser, delUser, queryPeople} from './api.js'

const routerList = [
  {path: '/api/addIssue', api: addIssue, method: 'post'}, // 问题录入/修改
  {path: '/api/delIssue', api: delIssue, method: 'get'}, // 问题删除
  {path: '/api/queryIssue', api: queryIssue, method: 'get'}, // 问题查询
  {path: '/api/submitAnswer', api: submitAnswer, method: 'post'}, // 提交答案及返回正确答案
  {path: '/api/addUser', api: addUser, method: 'get'}, // 新增用户
  {path: '/api/delUser', api: delUser, method: 'get'}, // 删除用户
  {path: '/api/queryPeople', api: queryPeople, method: 'get'} // 所有成员成绩查询
]

export default function useRouter(router) {
  routerList.forEach(item => {
    router[item.method](item.path, async (ctx, next) => {
      try {
        let requestBody
        if (item.method === 'get') {
          requestBody = ctx.query
        } else if (item.method === 'post') {
          requestBody = ctx.request.body
        }
        ctx.body = await item.api(requestBody)
      } catch (error) {
        ctx.status = 500
        ctx.body = {error: error.message}
      }
    })
  })
}
