<template>
  <UForm class="ivz-search ivz-bs-search" ref="ivzBasicForm" layout="inline">
    <template #default="{model}">
      <slot :model="model"></slot>
      <slot name="func"></slot>
    </template>
  </UForm>
</template>
<!-- 基础搜索组件 -->
<script>
import {inject, provide} from "vue";
import UForm from "@/components/form/basic/Form";
import {FuncContextKey, LinkViewContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import {SearchContext} from "@/components/view/Context";
import CoreConsts from "@/components/CoreConsts";

export default {
  name: "USearch",
  components: {UForm},
  props: {
    tid: {type: String, default: null},
    uid: {type: String, required: true, default: CoreConsts.DefaultSearchUid}
  },
  setup({uid}) {
    /**
     * @type {LinkContext}
     */
    let linkContext = inject(LinkViewContextKey);
    let searchContext = new SearchContext(linkContext);

    if(linkContext) {
      searchContext.uid = uid;
      linkContext.addChildrenContext(searchContext)
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
