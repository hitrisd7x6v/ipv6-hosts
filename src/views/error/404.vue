<template>
  <result status="404" title="404" sub-title="抱歉, 您访问的页面不存在.">
    <template #extra>
      <a-button type="primary" @click="$router.go(-1)">点击返回</a-button>
    </template>
  </result>
</template>

<script>
import result from 'ant-design-vue/es/result'
export default {
  name: "404",
  components: {result}
}
</script>

<style scoped>

</style>
