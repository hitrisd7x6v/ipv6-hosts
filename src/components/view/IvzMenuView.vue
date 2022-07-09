<template>
  <div class="ivz-page-view ivz-menu-view">
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

<script>
import {provide, ref} from "vue";
import {CloudUploadOutlined} from '@ant-design/icons-vue'
import {mapMutations, useStore} from "vuex";
import IvzUploadModal from "@/components/modal/UploadModal.vue";
import {FunMetaMaps} from "@/utils/SysUtils";

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
  components: {IvzUploadModal, CloudUploadOutlined},
  props: {
    // 删除提示框的提示信息 {title, content}
    delDescCall: {type: Function},
    // 唯一标识, 用于table的rowKey 或者用于判断编辑或者新增
    key: {type: String, default: 'id'},
    // 显示重置按钮
    reset: {type: Boolean, default: true},
    // 是否是编辑
    isEdit: {type: Function, default: null},
    // 新增标题
    addTitle: {type: String, default: '新增'},
    // 修改标题
    editTitle: {type: String, default: '编辑'},
    // 文件上传<IvzUploadModal>组件配置
    importProps: {type: Object, default: function () {
      return {
        accept: '.xls,.xlsx', title: '导入文件'
        , name: 'file', multiple: true, disabled: false
      }
    }},
  },
  setup(props) {
    // 获取当前激活的菜单
    let viewMenu = useStore().getters["sys/activityMenu"];
    let url = viewMenu['url'];

    // 注册当前菜单信息到视图列表
    useStore().commit('view/registerPageView', viewMenu);
    let viewInfo = useStore().getters['view/pageViewData'](url);

    // 设置视图页配置信息
    viewInfo.config = {...props}
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
  },
  created() {
    let $parent = this.$parent;

    // 暴露以下方法到其父组件
    let {getEditFunMeta, getTableFunMeta, getSearchFunMeta} = this.viewInfo;

    $parent['getEditFunMeta'] = getEditFunMeta;
    $parent['getTableFunMeta'] = getTableFunMeta;
    $parent['getSearchFunMeta'] = getSearchFunMeta;

    $parent['getViewMenu'] = () => this.viewMenu;
    $parent['getEditModel'] = () => this.viewInfo.editModel()
    $parent['getSearchModel'] = () => this.viewInfo.searchModel()
    $parent['getSelectedRows'] = () => this.viewInfo.selectedRows()

    $parent['loadingTableData'] = (promise) => this.viewInfo.loadingTableData(promise);

    $parent['getEditContext'] = () => this.viewInfo.editFormContext()
    $parent['getSearchContext'] = () => this.viewInfo.searchFormContext()


    if(this.importMeta) {
      this.importMeta.callback = (model, meta) => {
        this.$refs['uploadRef'].switchActive(true)
      }
    }
  },
  methods: {
    ...mapMutations({
      removePageViewData: 'view/removePageViewData',
    }),
    fileUploadChange() {

    }
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
