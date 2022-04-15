<script setup lang="ts">
import { ref } from 'vue'
import Upload from './upload.vue'
import History from './history.vue'

import type { TabsPaneContext } from 'element-plus'

const activeName = ref('uploadfile')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<template>
  <el-tabs
    tab-position="left"
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
    style="height: calc(100vh - 70px)"
  >
    <el-tab-pane label="上传图片" name="uploadfile">
      <Upload></Upload>
    </el-tab-pane>
    <el-tab-pane label="上传历史" name="historyfile">
      <History></History>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped></style>
