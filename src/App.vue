<script setup lang="ts">
import { ref, reactive } from 'vue'
import { changeBuffer } from './utils/changeBuffer'

// 等待上传文件
const inputFilesList = reactive<any[]>([])
// 获取文件选择器实例
const inputFileRef = ref<HTMLInputElement>()

// 打开文件选择器
const openFileSelected = () => {
  if (inputFileRef.value) {
    inputFileRef.value.click()
  }
}

// 文件选择触发
const inputFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (let i = 0; i < files?.length; i++) {
    inputFilesList.push(files[i])
  }
}

const cancelCurrentFile = (index: number) => {
  inputFilesList.splice(index, 1)
}

/**
 *  上传 
 */
const upload = async () => {
  if (inputFilesList.length === 0) {
    alert('请选择文件')
    return
  }

  // 首先要判断文件切片是否部分已经上传到服务器

  // 对文件进行切片处理【固定大小或者固定数量：以固定大小为主，当切片数量大于最大限制时候，采用固定切片，防止请求过多】


  for (let i = 0; i < inputFilesList.length; i++) {
    let maxSize = 1024 * 1024 * 1
    const {
      HASH,
      suffix
    } = await changeBuffer(inputFilesList[i])
    let count = Math.ceil(inputFilesList[i].size / maxSize)
    // 当切片数量大于最大限制时候，采用固定数量，防止请求过多
    if (count > 100) {
      count = 100
      maxSize = inputFilesList[i].size / count
    }

    // 开始切片操作
    let index = 0
    const chunks = []
    while (index < count) {
      const sliceFile = inputFilesList[i].slice(index * maxSize, (index + 1) * maxSize)
      chunks.push({
        file: sliceFile,
        name: `${HASH}_${index + 1}.${suffix}`
      })
      index++
    }
    chunks.forEach(file => {
      const post = {
        file: file.file,
        name: file.name
      }
      console.log(post)
    })
  }
}
</script>

<template>
  <div>
    <div class="btn" @click="openFileSelected" style="background-color: rgb(150, 150, 150);">
      选择文件
    </div>
    <div class="btn" @click="upload">
      上传
    </div>
    <input ref="inputFileRef" class="input_file" type="file" multiple @change="inputFileChange">
    <div class="file-list">
      <ul>
        <li v-for="(file, index) in inputFilesList">
          {{ file.name }}
          <span class="cancel-btn" @click="cancelCurrentFile(index)">取消</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  width: 120px;
  height: 40px;
  border-radius: 8px;
  background-color: rgb(75, 166, 237);
  color: #fff;
  cursor: pointer;
}

.input_file {
  display: none;
}

.cancel-btn {
  display: inline-block;
  margin-left: 20px;
  color: rgb(255, 64, 0);
  font-size: 14px;
  cursor: pointer;
}
</style>
