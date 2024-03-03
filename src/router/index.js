import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {title: '首页'},
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/questions',
    name: 'questions',
    meta: {title: '问题录入'},
    component: () => import('../views/questions/index.vue')
  },
  {
    path: '/exam',
    name: 'exam',
    meta: {title: '考试'},
    component: () => import('../views/exam/index.vue')
  },
  {
    path: '/query',
    name: 'query',
    meta: {title: '查询'},
    component: () => import('../views/query/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
