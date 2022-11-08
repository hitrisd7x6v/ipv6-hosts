<template>
  <ivz-form class="ivz-search ivz-bread-search" ref="ivzBsForm" layout="inline">
    <template #default="{model}">
      <slot :model="model"></slot>
      <a-row class="ivz-is-fun" align="middle">
        <a-col class="ivz-isf-bru" span="8">
          <a-breadcrumb>
            <a-breadcrumb-item>
              <HomeFilled style="color: dodgerblue"/>
            </a-breadcrumb-item>
            <template v-for="menu in breadcrumb" :key="menu.id">
              <a-breadcrumb-item v-if="menu.type != 8">
                <span>{{ menu.name }}</span>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-else>
                <a-dropdown>
                  <a class="ant-dropdown-link" @click.prevent>
                    {{menu.name}} <DownOutlined />
                  </a>
                  <template #overlay>
                    <a-menu @click="menuHandle">
                      <template v-for="item in menu.children" :key="item.id">
                        <a-menu-item :key="item.url" v-if="item.id != activityId">
                          <span>{{item.name}}</span>
                        </a-menu-item>
                      </template>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>
        </a-col>
        <a-col style="text-align: center" span="16">
          <slot name="fun" :metas="funMetas" :model="model">
            <a-space style="text-align: center; padding: 0px 16px">
              <template v-for="meta in funMetas" :key="meta.field">
                <IvzFuncBtn :func="meta.field" :meta="meta">{{meta.name}}</IvzFuncBtn>
              </template>
            </a-space>
          </slot>
        </a-col>
      </a-row>
    </template>
  </ivz-form>
</template>

<!-- 面包屑搜索 -->
<script>
import {DownOutlined, HomeFilled} from '@ant-design/icons-vue'
import IvzForm from "@/components/form/basic/IvzForm";
import {mapMutations, useStore} from "vuex";
import {inject} from "vue";
import {ViewContextKey} from "@/utils/ProvideKeys";

export default {
  name: "IvzBreadSearch",
  components: {IvzForm, DownOutlined, HomeFilled},
  props: {
    funMetas: {type: Array, default: () => []},
  },
  setup(props, {attrs}) {
    let activityMenu = useStore().getters['sys/activityMenu'];
    let breadcrumb = useStore().getters['sys/resolverBreadcrumb'];

    let searchContext = {};
    let activityId = activityMenu.id;
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

    return {breadcrumb, activityId, searchContext}
  },
  created() {
    let context = this.searchContext;
    context['getFormContext'] = this.getFormContext;
  },
  methods: {
    ...mapMutations({
      openUrlAndParentMenu: 'sys/openUrlAndParentMenu',
    }),
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
    menuHandle(menu) {
      this.openUrlAndParentMenu(menu.key);
    },

    getFormContext() {
      return this.$refs['ivzBsForm'].getFormContext();
    },

    /**
     * 重置搜索数据
     */
    resetSearchModel() {
      this.$refs['ivzBsForm'].resetFields();
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
.ivz-bread-search {
  width: 100%;
  padding: 8px;
  position: relative;
  background: #ffffff;
}

.ivz-bread-search .ivz-is-fun {
  width: 100%;
  height: 38px;
  padding: 0px;
  margin-top: 16px;
  line-height: 38px;
  background: #fefefe;
}

</style>
