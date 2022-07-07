<template>
  <ivz-form class="ivz-basic-search" ref="ivzBsForm">
    <template #default="{model}">
      <slot :model="model"></slot>
      <a-row class="ivz-is-fun" align="middle">
        <a-col class="ivz-isf-bru" span="8"></a-col>
        <a-col class="ivz-isf-btn" span="16">
          <slot name="fun" :metas="funMetas" :model="model">
            <a-space style="text-align: center; padding: 0px 16px">
              <template v-for="meta in funMetas" :key="meta.field">
                <ivz-button :meta="meta">{{meta.name}}</ivz-button>
              </template>
            </a-space>
          </slot>
        </a-col>
      </a-row>
    </template>
  </ivz-form>
</template>

<script>
import IvzForm from "@/components/form/basic/IvzForm";

export default {
  name: "IvzBasicSearch",
  components: {IvzForm},
  props: {
    align: '',
    size: String,
    direction: '',
    funMetas: {type: Array, default: () => []},
  },
  created() {
    // 为功能按钮单击事件创建代理
    this.funMetas.forEach(meta => {
      let eventProxy = () => {
        let bsForm = this.$refs['ivzBsForm'];
        let editModel = bsForm.getEditModel();

        let oriEvent = meta['callback'];
        if(typeof oriEvent == 'function') {
          oriEvent(editModel, meta, this.getSearchContext());
        }
      }

      meta['onClick'] = eventProxy;
    })
  },
  methods: {
    isView(meta) {
      let view = meta.view;
      if(typeof view == 'function') {
        let ivzFormRef = this.$refs['ivzBsForm'];
        if(ivzFormRef) {
          let editModel = ivzFormRef.getEditModel();
          return view(editModel, meta);
        }

        return true;
      } else {
        return view == null ? true : view;
      }
    },

    getSearchContext() {
      return this.$refs['ivzBsForm'].getFormContext();
    },

    /**
     * 重置搜索数据
     */
    resetSearchModel() {
      let defaultModel = this.$refs['ivzBsForm'].getDefaultModel();
      this.setSearchModel(defaultModel);
    },

    // 获取当前的搜索数据
    getSearchModel() {
      return this.$refs['ivzBsForm'].getEditModel();
    },

    // 设置当前的搜索数据
    setSearchModel(searchModel) {
      this.$refs['ivzBsForm'].setEditModel(searchModel);
    }
  }
}
</script>

<style scoped>
.ivz-basic-search {
  width: 100%;
  padding: 8px 16px;
  position: relative;
  background: #ffffff;
}
.ivz-is-fun {
  width: 100%;
  height: 38px;
  line-height: 38px;
  padding: 0px 16px;
  background: #fdfdfd;
}
.ivz-isf-btn {
  text-align: center;
}
.ivz-is-form {
  min-height: 52px;
  padding: 0px 24px;
}
</style>
