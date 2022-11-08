<template>
  <div style="width: 100%; height: 100%; text-align: center">
    <h2 style="color: #d98a00; margin-top: 30px">
      <a style="font-size: 30px; color: #ffa500" href="https://www.gitee.com/iteaj/ivzone" target="_blank">
        ivzone
      </a>是一套基于Vue3+Vite2+Antd2开发的后台管理通用模块
<!--      您的-->
<!--      <a href='https://gitee.com/iteaj/ivzone/stargazers'>-->
<!--        <img src='https://gitee.com/iteaj/ivzone/badge/star.svg?theme=gray' alt='star' />-->
<!--      </a>-->
<!--      是我们不懈追求的动力-->
    </h2>
    <div>
      <h3 class="site">
        <a>Vue3学习</a>
        <a>Vite2学习</a>
        <a>Antd2学习</a>
      </h3>
      <a href='https://gitee.com/iteaj/ivzone'>
        <img src='https://gitee.com/iteaj/ivzone/widgets/widget_6.svg?color=c71d23' alt='Fork me on Gitee' />
      </a>
    </div>
    <a-row style="margin-top: 16px">
      <a-col span="8">
        <h3 style="color: cornflowerblue">主要组件</h3>
      </a-col>
      <a-col span="8">
        <h3 style="color: cornflowerblue">主要包含以下功能</h3>
      </a-col>
      <a-col span="8">
        <h3 style="color: cornflowerblue">更新日志</h3>
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
</style>
