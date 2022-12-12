<template>
  <div class="ivz-page-view ivz-func-view">
    <slot></slot>
  </div>
</template>

<!--通过功能点配置生成的增删改查视图页-->
<script>
import {provide} from "vue";
import {useStore} from "vuex";
import {FunMetaMaps} from "@/utils/MetaUtils";
import {mergeMetaOfDefault} from "@/utils/MetaUtils";
import MixinConfigView from "@/components/view/MixinConfigView";
import router from "@/router";
import {$View, FuncMetaContext, ViewContext} from "@/components/view/ViewAction";
import {ViewContextKey} from "@/utils/ProvideKeys";
/**
 * 视图组件必须作为其父组件的顶级组件 如以下：
 * <template>
 *   <IvzFuncView>
 *     xxx
 *   </IvzFuncView>
 * </template>
 * 功能点视图页, 是居于自定义功能信息渲染而生成的页面
 */
export default {
  name: "IvzFuncView",
  mixins: [MixinConfigView],
  props: {
    // 编辑组件功能点
    editFunMetas: {type: Array, default: () => []},
    // 表格组件功能点
    tableFunMetas: {type: Array, default: () => []},
    // 搜索组件功能点
    searchFunMetas: {type: Array, default: () => []},
  },
  setup(props) {
    let route = router.currentRoute.value;

    // 获取当前激活的菜单
    let url = route.path;
    let viewMenu = useStore().getters["sys/urlMenuMaps"][url];
    if(!viewMenu) {
      throw new Error(`IvzFuncView组件必须依赖于当前激活的菜单[activityMenu=null]`);
    }

    // 注册当前菜单信息到视图列表
    useStore().commit('view/registerPageView', viewMenu);
    let viewInfo = useStore().getters['view/pageViewData'](url);

    // 设置视图页配置信息
    let {editFunMetas, tableFunMetas, searchFunMetas} = props;

    viewInfo.editFunMetas = editFunMetas;
    viewInfo.tableFunMetas = tableFunMetas;
    viewInfo.searchFunMetas = searchFunMetas;

    viewInfo.config.addTitle = props.addTitle ? props.addTitle : `新增${props.name}`;
    viewInfo.config.editTitle = props.editTitle ? props.editTitle : `编辑${props.name}`;

    if(editFunMetas instanceof Array) {
      editFunMetas.forEach(meta => mergeMetaOfDefault(meta))
    }

    if(tableFunMetas instanceof Array) {
      tableFunMetas.forEach(meta => mergeMetaOfDefault(meta))
    }

    if(searchFunMetas instanceof Array) {
      searchFunMetas.forEach(meta => mergeMetaOfDefault(meta))
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
  }
}
</script>

<style scoped>

</style>
