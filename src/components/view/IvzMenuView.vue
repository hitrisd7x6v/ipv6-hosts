<template>
  <div class="ivz-page-view ivz-basic-view">
    <slot></slot>
  </div>
</template>

<script>
import {provide} from "vue";
import {mapGetters, mapMutations, useStore} from "vuex";

/**
 * 视图组件必须作为其父组件的顶级组件 如以下：
 * <template>
 *   <IvzBasicView>
 *     xxx
 *   </IvzBasicView>
 * </template>
 *
 * 菜单视图, 是居于菜单信息渲染而生成的页面
 */
export default {
  name: "IvzMenuView",
  props: {
    // 唯一标识, 用于table的rowKey 或者用于判断编辑或者新增
    key: {type: String, default: 'id'},
    // 显示重置按钮
    reset: {type: Boolean, default: true},
    // 是否是编辑
    isEdit: {type: Function, default: null}
  },
  setup(props) {
    // 获取当前激活的菜单
    let viewMenu = useStore().getters["sys/activityMenu"];
    let url = viewMenu['url'];

    // 注册当前菜单信息到视图列表
    useStore().commit('view/registerPageView', viewMenu);
    let viewInfo = useStore().getters['view/pageViewData'](url);
    viewInfo.config = {...props}

    // 提供视图信息给其视图子组件
    provide('IvzViewInfo', viewInfo);

    return {viewMenu, url}
  },
  computed: {
    ...mapGetters({
      searchModel: 'view/searchModel',
      selectedRows: 'view/selectedRows',
      editFunMetas: 'view/editFunMetas',
      tableFunMetas: 'view/tableFunMetas',
      searchFunMetas: 'view/searchFunMetas',
      getPageViewData: 'view/pageViewData',
    })
  },
  created() {
    let url = this.url;
    let $parent = this.$parent;

    // 暴露以下方法到其父组件
    $parent['getViewMenu'] = () => this.getViewMenu;
    $parent['getSearchModel'] = () => this.searchModel(this.url)
    $parent['getEditFunMetas'] = () => this.editFunMetas(this.url)
    $parent['getSelectedRows'] = () => this.selectedRows(this.url)
    $parent['getTableFunMetas'] = () => this.tableFunMetas(this.url)
    $parent['getSearchFunMetas'] = () => this.searchFunMetas(this.url)
    $parent['switchEditVisible'] = (visible) => this.switchEditVisible({visible, url})
  },
  methods: {
    ...mapMutations({
      removePageViewData: 'view/removePageViewData',
      switchEditVisible: 'view/switchEditVisibleTo'
    }),
  },
  mounted() {
    // 校验此视图组件是父组件的顶级组件
  },
  unmounted() { // 在卸载的时候移除视图数据
    this.removePageViewData(this.viewMenu);
  }
}
</script>

<style scoped>

</style>
