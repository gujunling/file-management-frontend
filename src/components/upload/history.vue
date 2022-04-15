<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('hello History')
</script>

<template>
  <h1>{{ msg }}</h1>

  <iframe
    src="https://sweetheartjq.cn"
    width="100%"
    height="800px"
    class="test"
  ></iframe>
</template>

<style lang="scss" scoped>
.test {
  border: 1px solid;
}
</style>
