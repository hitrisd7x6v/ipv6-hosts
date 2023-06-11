<template>
  <div style="padding: 16px; height: 600px; overflow: auto">
    <a-tabs v-model:activeKey="activeKey" tab-position="left">
      <a-tab-pane key="1" tab="关于ivzone">
        <p>ivzone它是一套基于vue3+antdv2实现的通用增删改查组件库, 一套可以减少30%+以上代码量的通用组件</p>
        <p>它颠覆对增删改查模板的开发体验和使用方式, 具有实现优雅、代码简洁、通俗易懂、开发效率高、代码量减少30%+等优点(核心思想：为通用操作提供一个默认的实现，并实现各组件之间的联动，只做增强不做限制)</p>
        <p>使用最新的技术栈 基于vite2.0+vue3.0+antdv2+vuex4.0+vuerouter4</p>
        <p>提供一套后台管理常用功能模板(用户，角色，菜单，字典，机构，配置等)的实现</p>
      </a-tab-pane>
      <a-tab-pane key="4" tab="页级组件">
        <h2>什么是页级组件</h2>
        <p style="text-indent: 28px">一个页级别组件就是一个功能页面, 主要提供一套增删改查功能的api和子组件</p>
        <h2>有哪些页级组件</h2>
        <p style="text-indent: 28px">主要有三种 1. UView 2. IvzMenuView 3. IvzFuncView</p>
        <h3>页级组件有哪些通用的api</h3>
      </a-tab-pane>
      <a-tab-pane key="2" tab="UView 视图"><BasicView /></a-tab-pane>
      <a-tab-pane key="3" tab="IvzMenuView 视图"><MenuView /></a-tab-pane>
      <a-tab-pane key="5" tab="IvzFuncView 视图">待编写...</a-tab-pane>
      <a-tab-pane key="6" tab="USearch组件">待编写...</a-tab-pane>
      <a-tab-pane key="7" tab="UFormModal组件">待编写...</a-tab-pane>
      <a-tab-pane key="8" tab="options类型组件">待编写...</a-tab-pane>
      <a-tab-pane key="9" tab="UFuncBtn功能点组件">待编写...</a-tab-pane>
      <a-tab-pane key="10" tab="UFuncTag功能点组件">待编写...</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import 'vite-plugin-vuedoc/style.css'
import {ref} from "vue";
import MenuView from '@/doc/menu.doc.md'
import BasicView from '@/doc/basic.doc.md'
export default {
  name: "doc",
  components: {BasicView, MenuView},
  setup() {
    let activeKey = ref('1')
    return {activeKey}
  }
}
</script>

<style>
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
