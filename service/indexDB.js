import mysql from 'mysql'
import promisify from './promisify.js'
import config from './database.json' assert {type: 'json'}

// 创建数据库
const createDB = async con => {
  try {
    await promisify(con.query.bind(con))('CREATE DATABASE IF NOT EXISTS wkExamDB')
    console.log('Database wkExamDB created !')
  } catch (err) {
    console.error(err)
  }

  try {
    await promisify(con.query.bind(con))('USE wkExamDB')
    console.log('Switched to the database wkExamDB !')
  } catch (err) {
    console.error(err)
  }
}

// 创建题目表：id，排序，问题，选项，答案，是否单选
const createIssueTable = async con => {
  const sql = `CREATE TABLE IF NOT EXISTS issue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sort integer(32),
    issue VARCHAR(255),
    options JSON,
    answer JSON
  )`

  try {
    await promisify(con.query.bind(con))(sql)
    console.log('Table issue created !')
  } catch (err) {
    console.error(err)
  }
}

// 创建用户表：id，名字，总成绩，答案
const createUserTable = async con => {
  const sql = `CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    answer JSON,
    score integer(32)
  )`
  try {
    await promisify(con.query.bind(con))(sql)
    console.log('Table user created !')
  } catch (err) {
    console.error(err)
  }
}

const connect = mysql.createConnection(config)

connect.connect(async err => {
  if (err) {
    console.error(err)
  }
  await createDB(connect)
  await createIssueTable(connect)
  await createUserTable(connect)
  console.log('Connected!')
})

export default connect
