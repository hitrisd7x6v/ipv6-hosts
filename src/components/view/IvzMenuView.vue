<template>
  <div class="ivz-page-view ivz-menu-view">
    <slot></slot>
  </div>
</template>

<script>
import {provide, ref} from "vue";
import {mapMutations, useStore} from "vuex";
import {CloudUploadOutlined} from '@ant-design/icons-vue'
import MixinConfigView from "@/components/view/MixinConfigView";
import IvzUploadModal from "@/components/modal/IvzUploadModal.vue";
import {mergeMetaOfDefault, FunMetaMaps} from "@/utils/MetaUtils";
import router from "@/router";
import {$View, FuncMetaContext, ViewContext} from "@/components/view/ViewAction";
import {ViewContextKey} from "@/utils/ProvideKeys";

/**
 * 视图组件必须作为其父组件的顶级组件 如以下：
 * <template>
 *   <IvzMenuView>
 *     xxx
 *   </IvzMenuView>
 * </template>
 *
 * 菜单视图, 是居于菜单信息渲染而生成的页面
 */
export default {
  name: "IvzMenuView",
  mixins: [MixinConfigView],
  components: {IvzUploadModal, CloudUploadOutlined},
  props: {
    // 是否显示展开/缩收按钮
    expand: {type: Boolean, default: false},
  },
  setup(props) {
    let route = router.currentRoute.value;

    // 获取当前激活的菜单
    let url = route.path;
    let viewMenu = useStore().getters["sys/urlMenuMaps"][url];
    if(!viewMenu) {
      throw new Error(`IvzMenuView组件必须依赖于当前激活的菜单(功能点是通过菜单自动生成), 当前激活菜单为[null]`);
    }

    // 注册当前菜单信息到视图列表
    useStore().commit('view/registerPageView', viewMenu);
    let viewInfo = useStore().getters['view/pageViewData'](url);
    let {editFunMetas, tableFunMetas, searchFunMetas, config} = viewInfo;

    // 设置视图页配置信息
    viewInfo.config = {...props}
    viewInfo.config.addTitle = props.addTitle ? props.addTitle : `新增${props.name}`;
    viewInfo.config.editTitle = props.editTitle ? props.editTitle : `编辑${props.name}`;

    // 包含搜索功能并且需要显示重置功能按钮
    if(props.reset) {
      let resetFunMeta = viewInfo.getSearchFunMeta(FunMetaMaps.Reset);
      if(!resetFunMeta) {
        searchFunMetas.push({field: FunMetaMaps.Reset, name: '重置'})
      }

      let resetEditFunMeta = viewInfo.getEditFunMeta(FunMetaMaps.Reset);
      if(!resetEditFunMeta) {
        editFunMetas.push({field: FunMetaMaps.Reset, name: '重置'})
      }
    }

    // 包含展开功能
    let expandFunMeta = viewInfo.getSearchFunMeta(FunMetaMaps.Expanded);
    if(props.expand && !expandFunMeta) {
      searchFunMetas.push({field: FunMetaMaps.Expanded, name: '展开/折叠'})
    }

    if(editFunMetas instanceof Array) {
      editFunMetas.forEach(meta => mergeMetaOfDefault(meta))
      editFunMetas.sort((a, b) => a.sort > b.sort ? 1 : a.sort == b.sort ? 0 : -1);
    }

    if(tableFunMetas instanceof Array) {
      tableFunMetas.forEach(meta => mergeMetaOfDefault(meta))
      tableFunMetas.sort((a, b) => a.sort > b.sort ? 1 : a.sort == b.sort ? 0 : -1);
    }

    if(searchFunMetas instanceof Array) {
      searchFunMetas.forEach(meta => mergeMetaOfDefault(meta))
      searchFunMetas.sort((a, b) => a.sort > b.sort ? 1 : a.sort == b.sort ? 0 : -1);
    }

    // 提供视图信息给其视图子组件
    provide('IvzViewInfo', viewInfo);
    const viewContext = new ViewContext();
    let IvzView = new $View(viewContext);
    viewInfo['get$View'] = () => IvzView;

    viewContext.funMetasContext = new FuncMetaContext
    (editFunMetas, tableFunMetas, searchFunMetas);

    provide(ViewContextKey, viewContext);
    return {viewMenu, url, viewInfo, IvzView}
  },
  created() {
    // 暴露$View对象到父组件
    this.$parent.$view = this.IvzView;
  },
  mounted() {
    // 加载数据
    let viewMeta = this.viewInfo.getSearchFunMeta(FunMetaMaps.View);
    this.IvzView.query(viewMeta.url);
  }
}
</script>

<style>

</style>
