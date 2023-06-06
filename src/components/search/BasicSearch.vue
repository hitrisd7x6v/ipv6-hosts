<template>
  <UForm class="ivz-bs-search" ref="ivzBasicForm" layout="inline">
    <template #default="{model}">
      <slot :model="model"></slot>
    </template>
  </UForm>
</template>
<!-- 基础搜索组件 -->
<script>
import {inject, provide} from "vue";
import UForm from "@/components/form/basic/Form";
import {FuncContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import {SearchContext} from "@/components/view/Context";

export default {
  name: "USearch",
  components: {UForm},
  props: {
    primary: {type: Boolean}
  },
  setup(props, {attrs}) {
    let viewContext = inject(ViewContextKey);
    let searchContext = new SearchContext(viewContext);

    if(viewContext) {
      if(props.primary) {
        let primaryContext = viewContext["primarySearchContext"];
        if(primaryContext.isPrimary) {
          console.warn("当前视图页已经包含标识[primary]的搜索组件")
        } else {
          searchContext = primaryContext;
          searchContext.isPrimary = true; // 标记是主上下文
        }
      }
    }

    provide(FuncContextKey, searchContext);
    return {searchContext}
  },
  created() {
    this.searchContext['getFormContext'] = this.getFormContext;
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
