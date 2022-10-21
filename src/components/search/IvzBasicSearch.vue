<template>
  <ivz-form class="ivz-bs-search" ref="ivzBreadForm" layout="inline">
    <template #default="{model}">
      <slot :model="model"></slot>
    </template>
  </ivz-form>
</template>
<!-- 基础搜索组件 -->
<script>
import {inject} from "vue";
import IvzForm from "@/components/form/basic/IvzForm";

export default {
  name: "IvzBasicSearch",
  components: {IvzForm},
  props: { },
  setup() {
    let Context = inject(ViewContextKey) || {};
    if(Context) {
      if(Context["BasicSearchContext"]) {
        console.warn("IvzBasicSearch组件已经存在, 请标注[primary]声明主搜索")
      } else {
        Context["BasicSearchContext"] = {};
      }
    }

    return {Context}
  },
  created() {
    let context = this.Context['BasicSearchContext'];
    context['getSearchModel'] = this.getSearchModel;
    context['setSearchModel'] = this.setSearchModel;
    context['getSearchContext'] = this.getSearchContext;
    context['resetSearchModel'] = this.resetSearchModel;

  },
  methods: {

    getSearchContext() {
      return this.$refs['ivzBreadForm'].getFormContext();
    },

    /**
     * 重置搜索数据
     */
    resetSearchModel() {
      this.$refs['ivzBreadForm'].resetFields();
    },

    // 获取当前的搜索数据
    getSearchModel() {
      return this.$refs['ivzBreadForm'].getEditModel();
    },

    // 设置当前的搜索数据
    setSearchModel(searchModel) {
      this.$refs['ivzBreadForm'].setEditModel(searchModel);
    }
  }
}
</script>

<style scoped>
.ivz-bs-search {
  width: 100%;
  padding: 16px 8px;
  position: relative;
  background: #ffffff;
}

.ivz-is-fun {
  width: 100%;
  height: 38px;
  padding: 0px;
  margin-top: 16px;
  line-height: 38px;
  background: #fefefe;
}
.ivz-isf-btn {
  text-align: center;
}

</style>
