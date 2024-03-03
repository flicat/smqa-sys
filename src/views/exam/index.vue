<template>
  <el-form class="issue-list" label-width="120px" v-if="!userInfo">
    <el-form-item prop="sort" label="用户名">
      <el-input v-model="username" />
    </el-form-item>
    <el-form-item prop="sort" label="">
      <el-button type="primary" @click="regUser">开始答题</el-button>
    </el-form-item>
  </el-form>
  <el-form class="issue-list" label-width="120px" v-if="userInfo">
    <ul class="issue-item" v-for="item in allIssue" :key="item.id">
      <el-form-item prop="sort" label="问题：">
        {{ item.issue }}
        <el-icon class="success" v-if="correctAnswer[item.id] && userAnswer[item.id].sort().toString() == correctAnswer[item.id].sort().toString()"><Check /></el-icon>
        <span v-if="correctAnswer[item.id] && userAnswer[item.id].sort().toString() != correctAnswer[item.id].sort().toString()">
          <el-icon class="error"><Close /></el-icon>
          正确答案为{{ correctAnswer[item.id].sort().toString() }}
        </span>
      </el-form-item>
      <el-form-item prop="sort" label="选项：">
        <el-checkbox-group v-model="userAnswer[item.id]" :disabled="isSubmit">
          <el-checkbox v-for="option in item.options" :key="option" :label="option.key">{{ option.key }}.{{ option.value }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <hr />
    </ul>
    <el-form-item prop="sort" label="" v-if="!isSubmit">
      <el-button type="primary" @click.once="submit">提交答案</el-button>
    </el-form-item>
    <el-form-item prop="sort" label="得分：" v-if="isSubmit">{{ correctScore }}</el-form-item>
  </el-form>
</template>

<script setup>
import {getCurrentInstance, ref} from 'vue'
import {submitAnswer, addUser, queryIssue} from '../../api/index.js'

const app = getCurrentInstance()
const {$loading, $message} = app.appContext.config.globalProperties

const username = ref('') // 用户输入名称
const userInfo = ref(null) // 用户信息
const userAnswer = ref({}) // 用户答案
const correctAnswer = ref({}) // 正确答案
const correctScore = ref(0) // 总得分
const isSubmit = ref(false)

// 所有问题
const allIssue = ref([])

// 获取所有问题
const getAllIssue = async () => {
  const loading = $loading({text: '加载中……'})
  try {
    const result = await queryIssue()
    if (result.status === 200) {
      allIssue.value = result.data.result
    }
  } catch (e) {
    $message.error(e.data.error)
  }
  loading.close()
}

// 获取用户信息
const regUser = async () => {
  if (!username.value) {
    return $message.error('请输入用户名')
  }
  const loading = $loading({text: '加载中……'})
  try {
    const result = await addUser({name: username.value})
    if (result.status === 200) {
      userInfo.value = result.data.result
      userAnswer.value = result.data.result.answer
      correctScore.value = result.data.result.score
      isSubmit.value = Object.keys(userAnswer.value).length > 0
    }
  } catch (e) {
    $message.error(e.data.error)
  }
  loading.close()
}

// 提交答案以及返回正确答案
const submit = async () => {
  const loading = $loading({text: '加载中……'})
  try {
    const result = await submitAnswer({answer: userAnswer.value, userId: userInfo.value.id})
    if (result.status === 200) {
      correctAnswer.value = result.data.result.answer
      correctScore.value = result.data.result.score
      isSubmit.value = true
    }
  } catch (e) {
    $message.error(e.data.error)
  }
  loading.close()
}

getAllIssue()
</script>

<style lang="less" scoped></style>
