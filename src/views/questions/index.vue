<template>
  <el-form :model="formData" label-width="120px">
    <el-form-item prop="sort" label="排序">
      <el-input type="number" v-model.number="formData.sort" />
    </el-form-item>
    <el-form-item prop="issue" label="问题">
      <el-input type="textarea" v-model="formData.issue" />
    </el-form-item>
    <el-form-item prop="options" label="选项">
      <el-input v-model="formData.options[i].value" v-for="(item, i) in formData.options" :key="item">
        <template #prepend>{{ item.key }}</template>
        <template #append><el-button type="danger" icon="Delete" @click="delOption(i)"></el-button></template>
      </el-input>
      <el-button type="primary" @click="addOption">添加选项</el-button>
    </el-form-item>
    <el-form-item prop="answer" label="答案">
      <el-select v-model="formData.answer" multiple placeholder="答案">
        <el-option v-for="item in answerOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
  <hr />
  <el-form class="issue-list" label-width="120px">
    <ul class="issue-item" v-for="item in allIssue" :key="item.id">
      <el-form-item prop="sort" label="问题：">
        {{ item.issue }}
      </el-form-item>
      <el-form-item prop="sort" label="选项：">
        <span class="value" v-for="option in item.options" :key="option">{{ option.key }}.{{ option.value }}</span>
      </el-form-item>
      <el-form-item prop="sort" label="答案：">
        <span class="value" v-for="ans in item.answer" :key="ans">{{ ans }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editIssue(item.id)">编辑</el-button>
        <el-button type="primary" @click="removeIssue(item.id)">删除</el-button>
      </el-form-item>
    </ul>
  </el-form>
</template>

<script setup>
import {computed, getCurrentInstance, ref} from 'vue'
import {addIssue, delIssue, queryIssue} from '../../api/index.js'

const app = getCurrentInstance()
const {$confirm, $loading, $message} = app.appContext.config.globalProperties

const charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// 所有问题
const allIssue = ref([])

// 当前编辑问题
const formData = ref({
  id: null,
  // 排序
  sort: 0,
  // 问题
  issue: '',
  // 选项
  options: [],
  // 答案
  answer: []
})

// 添加选项
const addOption = () => {
  formData.value.options.push({
    get key() {
      return charMap[formData.value.options.indexOf(this)]
    },
    value: ''
  })
}
// 删除选项
const delOption = i => {
  formData.value.options.splice(i, 1)
}

// 答案列表
const answerOptions = computed(() => {
  return charMap.substr(0, formData.value.options.length).split('')
})

const resetForm = () => {
  formData.value = {
    id: null,
    sort: 0,
    issue: '',
    options: [],
    answer: []
  }
}

// 保存问题
const submitForm = async () => {
  const loading = $loading({text: '提交中……'})
  try {
    const result = await addIssue(formData.value)
    if (result.status === 200) {
      $message.success('保存成功！')
      getAllIssue()
    }
    resetForm()
  } catch (e) {
    $message.success(e.data.error)
  }
  loading.close()
}

// 编辑问题
const editIssue = id => {
  const issue = allIssue.value.find(item => item.id === id)
  if (issue) {
    formData.value = issue
  }
}
// 删除问题
const removeIssue = async id => {
  try {
    await $confirm('确定要删除问题？', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    })
    await delIssue({id})
    $message.success('删除成功！')
    getAllIssue()
  } catch (e) {
    if (e && e.data && e.data.error) {
      $message.error(e.data.error)
    }
  }
}

// 获取所有问题
const getAllIssue = async () => {
  const loading = $loading({text: '加载中……'})
  try {
    const result = await queryIssue({withAnswer: 1})
    if (result.status === 200) {
      allIssue.value = result.data.result
    }
  } catch (e) {
    $message.error(e.data.error)
  }
  loading.close()
}

getAllIssue()
</script>

<style lang="less" scoped></style>
