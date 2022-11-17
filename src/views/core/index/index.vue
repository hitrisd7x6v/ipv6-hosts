<template>
  <div style="width: 100%; height: 100%; text-align: center; overflow: auto">
    <h2 style="color: #d98a00; margin-top: 18px">
      <a style="font-size: 30px; color: #ffa500" href="https://www.gitee.com/iteaj/ivzone" target="_blank">
        ivzone
      </a>是一套基于Vue3+Vite2+Antd2开发的后台管理通用模块
      <div style="color: #909090; font-size: 14px">UI布局和API兼具灵活、简洁、优美</div>
      <div style="color: #909090; font-size: 14px">约定大于配置、模块化</div>
      <!--      您的-->
<!--      <a href='https://gitee.com/iteaj/ivzone/stargazers'>-->
<!--        <img src='https://gitee.com/iteaj/ivzone/badge/star.svg?theme=gray' alt='star' />-->
<!--      </a>-->
<!--      是我们不懈追求的动力-->
    </h2>
    <div>
      <h3 class="site">
        <a href="https://vue3js.cn/docs/zh/guide/introduction.html" target="_blank">Vue3入门教程</a>
        <a href="https://cn.vitejs.dev/guide/" target="_blank">Vite2入门教程</a>
        <a href="https://2x.antdv.com/docs/vue/getting-started-cn" target="_blank">Antd2入门教程</a>
      </h3>
      <a href='https://gitee.com/iteaj/ivzone'>
        <img src='https://gitee.com/iteaj/ivzone/widgets/widget_6.svg?color=c71d23' alt='Fork me on Gitee' />
      </a>
    </div>
    <a-row style="margin-top: 16px" :hoverable="true" class="row">
      <a-col span="8" class="col">
        <a-card :bordered="true" :hoverable="true">
          <template #title>
            <h4 style="color: royalblue">主要组件</h4>
          </template>
          <div class="context">
            1. 通用增删改查组件：IvzBasicView、IvzFuncView、IvzMenuView, 支持通过精简的Api(add, del, edit, query, import, export)提供
            2. IvzBasicTable： 支持slot
          </div>
        </a-card>
      </a-col>
      <a-col span="8" class="col">
        <a-card :bordered="true" :hoverable="true">
          <template #title>
            <h3 style="color: #d98a00">主要包含以下功能</h3>
          </template>
          <div class="context">
            <p>1. 提供一套完整的通用的增删改查组件, 提升通用模板功能的开发速度、效率</p>
            <p>2. 通过数据源生成Radio、Select、Checkbox等Antd2支持options数据渲染的组件</p>
            <p>3. 表组件支持通过url和字典获取对应的数据源后将值转化成label进行渲染</p>
            <p>4. 表格和表单支持使用嵌套格式的字段(user.account.amount)</p>
            <p>5. 增强Antd2库的某些组件比如(ATable, ARow, AForm, AModal, ADrawer)</p>
            <p style="color: #7f7f7f">6. 支持动态菜单, 支持从任何数据源生成菜单</p>
            <p style="color: #7f7f7f">7. 支持将第三方库独立打包成esm类型的库, 减少每次更新时包的大小和降低系统加载速度</p>
            <p style="color: #7f7f7f">8. 支持数据mock, 可以不依赖后端的数据源, 更加灵活的开发调试</p>
          </div>
        </a-card>
      </a-col>
      <a-col span="8" class="col">
        <a-card :bordered="true" :hoverable="true">
          <template #title>
            <h4 style="color: royalblue">更新日志(2.0.0)</h4>
          </template>
          <div class="context">
            <h4>版本号：2.0.0</h4>
            <a-timeline style="text-align: left">
              <a-timeline-item color="green">2021-07-24
                <p>1. 修改 crud api 在编辑的时候获取model和url错误</p>
                <p>2. 新增 任务栏上面增加刷新功能</p>
                <p>3. 修改 编辑组件不显示标题问题</p>
                <p>4. 新增 为所有已实现功能添加标题</p>
              </a-timeline-item>
              <a-timeline-item color="green">2021-07-21
                <p>1. 新增 首页, 用来做系统简介</p>
                <p>2. 修改 在IvzBreadSearch组件中使用IvzFuncBtn功能按钮组件</p>
              </a-timeline-item>
              <a-timeline-item color="green">2021-07-20
                <p>1. 修改 字典页IvzFuncBtn类型错误问题</p>
                <p>2. 修改 IvzBasicTable组件切换分页和条数不重新加载问题</p>
                <p>3. 修改 删除行提示框不显示提示内容问题</p>
                <p>4. $View对象新增多个api来操作元数据</p>
              </a-timeline-item>
              <a-timeline-item color="green">2021-07-19
                <p>1. 重构IvzBasicDrawer、IvzBasicModal组件</p>
                <p>2. 去除IvzMenuView的导入插槽, 将导入功能将以单独组件提供</p>
                <p>4. 修改删除和提交api返回Promise, 用来做成功的获取操作</p>
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<!--首页或者工作台-->
<script>
export default {
  name: "Index",
}
</script>

<style scoped>
.site {
  margin-top: 8px;
}
.site a {
  font-size: 18px;
  margin: 3px 12px;
  color: #7f7f7f;
}

.row .col {
  padding: 0px 8px;
}
.context {
  text-align: left;
}
</style>
