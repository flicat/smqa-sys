import Koa from 'koa'
import Router from '@koa/router'
import koaStatic from 'koa-static'
import useRouter from './service/router.js'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import bodyParser from 'koa-bodyparser'

// 获取当前文件的 URL
const __filename = fileURLToPath(import.meta.url)

// 获取当前文件的目录
const __dirname = dirname(__filename)

const app = new Koa()
const router = new Router()

// 设置静态资源文件夹的路径
app.use(
  koaStatic(join(__dirname, './dist'), {
    index: 'index.html',
    defer: true
  })
)

app.use(bodyParser())

// 定义路由
useRouter(router)

// 将路由中间件添加到应用
app.use(router.routes()).use(router.allowedMethods())

// 启动服务器
const server = app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
