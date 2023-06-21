<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script>
import './theme/index.css'
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default {
  name: 'App',
  setup() {
    return {zhCN}
  }
}
</script>

<style>
#app {
  height: 100%;
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
