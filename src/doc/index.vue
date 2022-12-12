<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" tabPosition="left">
      <a-tab-pane key="1" tab="IvzBasicView 基础视图页">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane key="2" tab="IvzMenuView 菜单视图页">Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="IvzFuncView 功能视图页">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import 'vite-plugin-vuedoc/style.css'
import {ref} from "vue";
export default {
  name: "doc",
  setup() {
    let activeKey = ref('2')
    return {activeKey}
  }
}
</script>

<style scoped>

</style>