<template>
  <el-form class="people-list" label-width="120px">
    <el-form-item v-for="item in peopleList" :key="item.id" :label="item.name">
      {{ item.score }}分
      <el-button type="danger" icon="Delete" circle @click="deleteUser(item.id)" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import {getCurrentInstance, ref} from 'vue'
import {delUser, queryPeople} from '../../api/index.js'

const app = getCurrentInstance()
const {$confirm, $loading, $message} = app.appContext.config.globalProperties

const peopleList = ref([])

// 获取所有用户
const getAllPeople = async () => {
  const loading = $loading({text: '加载中……'})
  try {
    const result = await queryPeople()
    if (result.status === 200) {
      peopleList.value = result.data.result
    }
  } catch (e) {
    $message.error(e.data.error)
  }
  loading.close()
}

// 删除用户
const deleteUser = async id => {
  try {
    await $confirm('确定要删除用户？', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    })
    await delUser({id})
    $message.success('删除成功！')
    getAllPeople()
  } catch (e) {
    if (e && e.data && e.data.error) {
      $message.error(e.data.error)
    }
  }
}

getAllPeople()
</script>

<style lang="less" scoped></style>
