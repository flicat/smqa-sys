import DBconnect from './indexDB.js'
import promisify from './promisify.js'

// 问题录入/修改
export async function addIssue(data) {
  const {sort, issue, options, answer} = data
  if (!/^\d+$/.test(sort)) {
    throw new Error('排序只能是数字')
  }
  if (!issue) {
    throw new Error('请输入问题')
  }
  if (!Array.isArray(options) || !options.length) {
    throw new Error('请输入选项')
  }
  if (!Array.isArray(answer) || !answer.length) {
    throw new Error('请输入答案')
  }

  let sql
  if (data.id) {
    sql = `UPDATE issue
          SET
              sort = ${Number(sort)},
              issue = '${issue}',
              options = '${JSON.stringify(options)}',
              answer = '${JSON.stringify(answer)}'
          WHERE
              id = ${data.id};`
  } else {
    sql = `INSERT INTO issue (sort, issue, options, answer) VALUES (${Number(sort)}, '${issue}', '${JSON.stringify(options)}', '${JSON.stringify(answer)}');`
  }

  try {
    await promisify(DBconnect.query.bind(DBconnect))(sql)
    return {message: '添加成功'}
  } catch (err) {
    throw err
  }
}

// 问题删除
export async function delIssue(query) {
  if (!query.id) {
    throw new Error('请选择问题')
  }

  const sql = `DELETE FROM issue WHERE id = ${query.id};`

  try {
    await promisify(DBconnect.query.bind(DBconnect))(sql)
    return {message: '删除成功'}
  } catch (err) {
    throw err
  }
}

// 问题查询
export async function queryIssue(query) {
  const sql = `SELECT id, sort, issue, options${query && query.withAnswer ? ', answer' : ''} FROM issue;`

  try {
    const result = await promisify(DBconnect.query.bind(DBconnect))(sql)
    if (Array.isArray(result)) {
      result.forEach(row => {
        if (row.options) {
          row.options = JSON.parse(row.options)
        }
        if (row.answer) {
          row.answer = JSON.parse(row.answer)
        }
      })
    }
    return {message: '查询成功', result}
  } catch (err) {
    throw err
  }
}

// 提交答案及返回正确答案
export async function submitAnswer(data) {
  const {answer, userId} = data

  if (typeof answer !== 'object') {
    throw new Error('答案格式错误')
  }
  if (!userId) {
    throw new Error('用户不存在')
  }

  try {
    const answerSql = `SELECT id, answer FROM issue;`
    const result = await promisify(DBconnect.query.bind(DBconnect))(answerSql)

    let score = 0
    let answerMap
    if (Array.isArray(result)) {
      // 算分
      answerMap = result.reduce((target, item) => {
        if (item.answer) {
          item.answer = JSON.parse(item.answer)
        }
        target[item.id] = item.answer
        return target
      }, {})
      Object.entries(answerMap).forEach(([id, value]) => {
        if (Array.isArray(answer[id]) && answer[id].sort().toString() === value.toString()) {
          score++
        }
      })
    }

    const insertSql = `UPDATE user SET answer = '${JSON.stringify(answer)}', score=${score} WHERE id = ${userId};`
    await promisify(DBconnect.query.bind(DBconnect))(insertSql)

    return {message: '提交成功', result: {answer: answerMap, score}}
  } catch (err) {
    throw err
  }
}

// 新增用户
export async function addUser(query) {
  if (!query.name) {
    throw new Error('请输入名字')
  }
  const selectSql = `SELECT * FROM user WHERE name = '${query.name}';`
  const initSql = `INSERT INTO user (name, answer, score) VALUES ('${query.name}', '{}', 0);`
  try {
    let result = await promisify(DBconnect.query.bind(DBconnect))(selectSql)
    if (!result || !result.length) {
      await promisify(DBconnect.query.bind(DBconnect))(initSql)
      result = await promisify(DBconnect.query.bind(DBconnect))(selectSql)
    }
    const user = result[0]
    if (user && user.answer) {
      user.answer = JSON.parse(user.answer)
    }
    return {message: '查询成功', result: user}
  } catch (err) {
    throw err
  }
}

// 删除用户
export async function delUser(query) {
  if (!query.id) {
    throw new Error('请选择用户')
  }

  const sql = `DELETE FROM user WHERE id = ${query.id};`

  try {
    await promisify(DBconnect.query.bind(DBconnect))(sql)
    return {message: '删除成功'}
  } catch (err) {
    throw err
  }
}

// 所有成员成绩查询
export async function queryPeople() {
  const sql = `SELECT id, name, score FROM user;`

  try {
    const result = await promisify(DBconnect.query.bind(DBconnect))(sql)
    return {message: '查询成功', result}
  } catch (err) {
    throw err
  }
}
