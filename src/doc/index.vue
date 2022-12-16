<template>
  <div style="padding: 16px">
    <a-tabs v-model:activeKey="activeKey" tab-position="left">
      <a-tab-pane key="1" tab="关于ivzone">
        <p>ivzone它是一套基于vue3+antdv2实现的通用增删改查组件库</p>
        <p>它颠覆对增删改查模板的开发体验和使用方式, 具有实现优雅、代码简洁、通俗易懂、开发效率高、代码量减少30%+等优点(核心思想：为通用操作提供一个默认的实现，并实现各组件之间的联动，只做增强不做限制)</p>
        <p>使用最新的技术栈 基于vite2.0+vue3.0+antdv2+vuex4.0+vuerouter4</p>
        <p>提供一套后台管理常用功能模板(用户，角色，菜单，字典，机构，配置等)的实现</p>
      </a-tab-pane>
      <a-tab-pane key="4" tab="页级组件">
        <h2>什么是页级组件</h2>
        <p style="text-indent: 28px">一个页级别组件就是一个功能页面, 主要提供一套增删改查功能的api和子组件</p>
        <h2>有哪些页级组件</h2>
        <p style="text-indent: 28px">主要有三种 1. IvzBasicView 2. IvzMenuView 3. IvzFuncView</p>
        <h3>页级组件有哪些通用的api</h3>
      </a-tab-pane>
      <a-tab-pane key="2" tab="页级组件之 IvzBasicView"><BasicView /></a-tab-pane>
      <a-tab-pane key="3" tab="页级组件之 IvzMenuView">待编写...</a-tab-pane>
      <a-tab-pane key="5" tab="页级组件之 IvzFuncView">待编写...</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import 'vite-plugin-vuedoc/style.css'
import {ref} from "vue";
import BasicView from '@/doc/basic.doc.md'
export default {
  name: "doc",
  components: {BasicView},
  setup() {
    let activeKey = ref('1')
    return {activeKey}
  }
}
</script>

<style scoped>
.ivz-doc-title {
  list-style: none;
  padding-left: 36px;
  margin-top: 36px;
}
.ivz-doc-title li {
  padding: 12px 8px;
}
.ivz-doc-content {
  overflow: auto;
}
</style>