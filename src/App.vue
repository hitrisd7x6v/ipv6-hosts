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
.ivz-default-search {
  padding: 8px;
}
/*功能点样式*/
.ivz-fm {
  margin: 0px 6px;
}

/*表格功能组件样式*/
.ivz-ibt-fun.disabled {
  cursor: not-allowed!important;
  background-color: #c7c7c7 !important;
}
</style>
