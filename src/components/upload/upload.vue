<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'
import axios from 'axios'
import { cloneData } from '../../utils/index'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const {
  proxy: { $forceUpdate }
}: any = getCurrentInstance()
const form = reactive({
  name: '',
  path: '',
  url: '',
  markdown: ''
})
const imageUrl = ref('')
const dialogFormVisible = ref(false)
const formLabelWidth = ref('120px')
const dialogImageUrl = ref('')
let imagesArr: any[] = []

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  if (response.code === '200') {
    form.name = response.image
    // 此时只获取当前主机地址，如需获取主机名加端口请使用window.location.host
    form.url =
      'http://' + window.location.hostname + '/images/' + response.image
    console.log('地址', window.location.hostname)
    form.path = '/images/' + response.image
    form.markdown = '![](' + form.url + ')'
    uploadFile.name = response.image
    const currentImage = cloneData(form)
    imagesArr.push(currentImage)
    // 此处有问题
    dialogImageUrl.value = String(form.url)
    console.log('回显地址', dialogImageUrl.value)

    dialogFormVisible.value = true
  } else {
    ElMessage({
      message: '上传失败！',
      type: 'error'
    })
    console.log('失败了', response)
  }
}
const handlePictureCardPreview: UploadProps['onPreview'] = file => {
  console.log(file)
  dialogImageUrl.value = String(file.url)
  dialogFormVisible.value = true
}
const handleRemove: UploadProps['onRemove'] = uploadFile => {
  axios
    .post('/upload/deleteFileByName?filename=' + uploadFile.name)
    .then(res => {
      if (res.data && res.data.code == '200') {
        ElMessage({
          message: '删除成功！',
          type: 'success'
        })
        let index = imagesArr.map(v => v.name).indexOf(uploadFile.name)
        if (index !== -1) {
          imagesArr.splice(index, 1)
        }
        // 删除之后数据改变了但页面没有更新，此时需要强制刷新
        $forceUpdate()
      }
    })
    .catch(error => {
      console.log('删除失败', error)
    })
}
</script>

<template>
  <el-upload
    action="upload/fileUpload"
    :multiple="true"
    list-type="picture-card"
    :on-success="handleAvatarSuccess"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>

  <div v-if="imagesArr.length > 0">
    {{ imagesArr }}
  </div>

  <el-dialog
    v-model="dialogFormVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    title="上传结果"
  >
    <el-image :src="dialogImageUrl" :preview-src-list="[dialogImageUrl]">
    </el-image>
    <el-form :model="form">
      <el-form-item label="相对路径" :label-width="formLabelWidth">
        <el-input v-model="form.path" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="文件URL" :label-width="formLabelWidth">
        <el-input v-model="form.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="MARKDOWN" :label-width="formLabelWidth">
        <el-input v-model="form.markdown" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="服务器文件名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
