<template>
  <div style="width: 100%; height: 100%; overflow: auto" class="ivz-index">
    <div class="ivz-ii-project">ivzone</div>
    <div class="ivz-ii-link">
      <div class="ivz-iil-doc">
        <a target="_blank" href="http://doc.iteaj.com/izone" style="vertical-align: -1.7px">
          开发文档
        </a>
      </div>
      <div class="ivz-iil-lcd">
        <a target="_blank" href="http://online.iteaj.com">
          代码生成器
        </a>
      </div>
    </div>
    <IvzEditor />
  </div>
</template>
<!--首页或者工作台-->
<script>
import IvzEditor from '@/components/form/editor/index.vue'
export default {
  name: "Index",
  components: {IvzEditor}
}
</script>

<style scoped>
.ivz-ii-project {
  height: 64px;
  color: #d46b08;
  font-size: 32px;
  margin-top: 8px;
  line-height: 64px;
  text-align: center;
}
.ivz-ii-link {
  height: 52px;
  line-height: 50px;
  text-align: center;
}
.ivz-iil-doc,.ivz-iil-lcd {
  width: 50%;
  float: left;
  font-size: 18px;
}
.ivz-iil-doc {
  text-align: right;
  padding-right: 32px;
}
.ivz-iil-lcd {
  text-align: left;
  padding-left: 32px;
}
</style>
