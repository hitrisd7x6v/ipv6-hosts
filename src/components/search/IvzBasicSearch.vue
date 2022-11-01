<template>
  <ivz-form class="ivz-bs-search" ref="ivzBasicForm" layout="inline">
    <template #default="{model}">
      <slot :model="model"></slot>
    </template>
  </ivz-form>
</template>
<!-- 基础搜索组件 -->
<script>
import {inject} from "vue";
import IvzForm from "@/components/form/basic/IvzForm";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default {
  name: "IvzBasicSearch",
  components: {IvzForm},
  props: { },
  setup(props, {attrs}) {
    let searchContext = {};
    let viewContext = inject(ViewContextKey);

    if(viewContext) {
      let primary = attrs.primary;
      if(primary == '' || primary == true) {
        let primaryContext = viewContext["primarySearchContext"];
        if(primaryContext.isPrimary) {
          console.warn("当前视图页已经包含主搜索[primary]组件")
        } else {
          searchContext = primaryContext;
          searchContext.isPrimary = true; // 标记是主上下文
        }
      }
    }

    return {searchContext}
  },
  created() {
    let context = this.searchContext;
    context['getFormContext'] = this.getFormContext;
  },
  methods: {

    getSearchContext() {
      return this.searchContext;
    },

    getFormContext() {
      return this.$refs['ivzBasicForm'].getFormContext();
    },

    /**
     * 重置搜索数据
     */
    resetSearchModel() {
      this.$refs['ivzBasicForm'].resetFields();
    },

    // 获取当前的搜索数据
    getSearchModel() {
      return this.$refs['ivzBasicForm'].getEditModel();
    },

    // 设置当前的搜索数据
    setSearchModel(searchModel) {
      this.$refs['ivzBasicForm'].setEditModel(searchModel);
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
