<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
// import { cloneData } from '../../utils/index'
import { cloneData } from '@/utils/index'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

// const {
//   proxy: { $forceUpdate }
// }: any = getCurrentInstance()
const form = reactive({
  name: '',
  path: '',
  url: '',
  markdown: ''
})
const fileType = ref()
const dialogFormVisible = ref(false)
const formLabelWidth = ref('120px')
const dialogImageUrl = ref()
// let imagesArr: any[] = []

//定义一个具有响应式的数组，定义一个响应式对象，然后其内部定义一个数组，注意，此时的数组类型需要在reactive中使用泛型书写
const imagesArr = reactive<any>({
  arr: []
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  if (response.code === '200') {
    form.name = response.image
    // 此时只获取当前主机地址，如需获取主机名加端口请使用window.location.host
    form.url =
      'https://' + window.location.hostname + '/images/' + response.image
    console.log('主机地址', window.location.hostname)
    form.path = '/images/' + response.image
    form.markdown = '![](' + form.url + ')'
    uploadFile.name = response.image
    const currentImage = cloneData(form)
    imagesArr.arr.push(currentImage)
    fileType.value = form.name
      .substring(form.name.lastIndexOf('.') + 1)
      .toLocaleLowerCase()
    console.log('文件类型', fileType.value)
    if (
      fileType.value === 'png' ||
      fileType.value === 'jpg' ||
      fileType.value === 'jpeg' ||
      fileType.value === 'gif'
    ) {
      dialogImageUrl.value = String(form.url)
    }

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
        let index = imagesArr.arr
          .map((v: any) => v.name)
          .indexOf(uploadFile.name)
        if (index !== -1) {
          imagesArr.arr.splice(index, 1)
        }
      }
    })
    .catch(error => {
      console.log('删除失败', error)
    })
}

// 复制URL/Markdown
const onCopyUrl = (url: string) => {
  let transfer = document.createElement('input')
  document.body.appendChild(transfer)
  transfer.value = url // 这里表示想要复制的内容
  transfer.focus()
  transfer.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    transfer.blur()

    ElMessage({
      message: '复制成功！',
      type: 'success'
    })
  } else {
    ElMessage({
      message: '当前浏览器好像不支持直接复制，请在页面中直接选中然后复制！',
      type: 'warning'
    })
    return
  }
  document.body.removeChild(transfer)
  dialogFormVisible.value = false
}
// 清除全部
const uploadRef = ref()
const onClearAll = () => {
  console.log('清除全部')
  uploadRef.value.clearFiles()
  imagesArr.arr = []
  dialogFormVisible.value = false
}
</script>

<template>
  <el-upload
    ref="uploadRef"
    action="upload/fileUpload"
    :multiple="true"
    drag
    list-type="picture-card"
    :on-success="handleAvatarSuccess"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
  >
    <el-icon class="el-icon--upload"><Plus /></el-icon>
  </el-upload>

  <div v-if="imagesArr.arr.length > 0">
    {{ imagesArr.arr }}
  </div>

  <el-dialog
    v-model="dialogFormVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    title="上传结果"
  >
    <el-image
      v-if="
        dialogImageUrl &&
        dialogImageUrl.length > 0 &&
        (fileType === 'png' ||
          fileType === 'jpg' ||
          fileType === 'jpeg' ||
          fileType === 'gif')
      "
      :src="dialogImageUrl"
      :preview-src-list="[dialogImageUrl]"
    >
    </el-image>
    <el-form :model="form">
      <el-form-item label="相对路径" :label-width="formLabelWidth">
        <el-input v-model="form.path" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="文件URL" :label-width="formLabelWidth">
        <el-input v-model="form.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        v-if="
          fileType === 'png' ||
          fileType === 'jpg' ||
          fileType === 'jpeg' ||
          fileType === 'gif'
        "
        label="Markdown格式"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.markdown" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="服务器文件名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCopyUrl(form.url)">复制 URL </el-button>
        <el-button
          v-if="
            fileType === 'png' ||
            fileType === 'jpg' ||
            fileType === 'jpeg' ||
            fileType === 'gif'
          "
          @click="onCopyUrl(form.markdown)"
          >复制 Markdown</el-button
        >
        <el-button @click="onClearAll">清除全部</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  width: 148px;
  height: 148px;
}
</style>
