<template>
  <div class="ivz-page-view ivz-func-view">
    <slot></slot>
    <slot name="import">
      <ivz-upload-modal ref="uploadRef" :upload="importProps"
                        tip="文件导入中..." :title="importProps.title">
        <template #desc>
          <slot name="desc">
            <span>点击选择或者拖入需要导入的文件</span>
            <div style="color: red; padding: 3px 0px; font-size: 13px">
              注：只支持以下文件格式 {{importProps.accept}}
            </div>
          </slot>
        </template>
      </ivz-upload-modal>
    </slot>
  </div>
</template>

<!--通过功能点配置生成的增删改查视图-->
<script>
import {provide} from "vue";
import {useStore} from "vuex";
import {FunMetaMaps} from "@/utils/SysUtils";
import MixinConfigView from "@/components/view/MixinConfigView";
import IvzUploadModal from "@/components/modal/IvzUploadModal.vue";

export default {
  name: "IvzFuncView",
  mixins: [MixinConfigView],
  components: {IvzUploadModal},
  props: {
    // 编辑组件功能点
    editFunMetas: {type: Array, default: () => []},
    // 表格组件功能点
    tableFunMetas: {type: Array, default: () => []},
    // 搜索组件功能点
    searchFunMetas: {type: Array, default: () => []},
  },
  setup(props) {
    // 获取当前激活的菜单
    let viewMenu = useStore().getters["sys/activityMenu"];
    if(!viewMenu) {
      throw new Error(`IvzFuncView组件必须依赖于当前激活的菜单[activityMenu=null]`);
    }

    let url = viewMenu['url'];
    // 注册当前菜单信息到视图列表
    useStore().commit('view/registerPageView', viewMenu);
    let viewInfo = useStore().getters['view/pageViewData'](url);

    // 设置视图页配置信息
    viewInfo.config = {...props}
    delete viewInfo.config.editFunMetas;
    delete viewInfo.config.tableFunMetas;
    delete viewInfo.config.searchFunMetas;
    let {editFunMetas, tableFunMetas, searchFunMetas} = props;

    viewInfo.editFunMetas = editFunMetas;
    viewInfo.tableFunMetas = tableFunMetas;
    viewInfo.searchFunMetas = searchFunMetas;

    if(!viewInfo.config.isEdit) { // 判断编辑视图是属于新增还是编辑
      let key = viewInfo.config.key;
      viewInfo.config.isEdit = (model) => model[key] != null
    }
    if(!viewInfo.config.delDescCall) { // 删除回调,
      viewInfo.config.delDescCall = (model, viewInfo) =>
      {return {title: '删除', content: '确定要删除此条记录吗？'}}
    }

    // 导入文件
    let importMeta = viewInfo.getSearchFunMeta(FunMetaMaps.Import);
    if(importMeta) {
      props.importProps.action = importMeta.url;
    }

    // 提供视图信息给其视图子组件
    provide('IvzViewInfo', viewInfo);
    return {viewMenu, url, viewInfo, importMeta}
  }
}
</script>

<style scoped>

</style>
