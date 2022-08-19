<template>
  <ivz-form class="ivz-bs-search" ref="ivzBsForm" layout="inline">
    <template #default="{model}">
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
                      <template v-for="item in menu.children" :key="item.url">
                        <a-menu-item :key="item.url" v-if="item.id != activityId">
                          <a href="javascript:;">{{item.name}}</a>
                        </a-menu-item>
                      </template>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>
        </a-col>
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
      <slot :model="model"></slot>
    </template>
  </ivz-form>
</template>

<script>
import {DownOutlined, HomeFilled} from '@ant-design/icons-vue'
import IvzForm from "@/components/form/basic/IvzForm";
import {mapMutations, useStore} from "vuex";

export default {
  name: "IvzBasicSearch",
  components: {IvzForm, DownOutlined, HomeFilled},
  props: {
    funMetas: {type: Array, default: () => []},
  },
  setup() {
    let activityMenu = useStore().getters['sys/activityMenu'];
    let activityId = activityMenu.id;
    let breadcrumb = useStore().getters['sys/resolverBreadcrumb'];

    return {breadcrumb, activityId}
  },
  created() {
    // 为功能按钮单击事件创建代理
    if(this.funMetas instanceof Array) {
      this.funMetas.forEach(meta => {
        let clickOriEvent = meta.props['onClick'];
        if(!clickOriEvent && import.meta.env.DEV) {
          console.warn(`组件[IvzBasicSearch]的功能[${meta.field}]没有监听点击事件`)
        }

        // 为原事件创建代理, 增加原数据meta和编辑对象editModel
        meta.props['onClick'] = () => {
          let bsForm = this.$refs['ivzBsForm'];
          let editModel = bsForm.getEditModel();
          let searchContext = this.getSearchContext();
          if(clickOriEvent) {
            clickOriEvent(editModel, meta, searchContext)
          } else {
            console.error(`组件[IvzBasicSearch]功能[${meta.field}]没有监听点击事件[meta.props.onClick=undefined]`)
          }
        }
      });

    }
  },
  methods: {
    ...mapMutations({
      openUrlTaskAndMenu: 'sys/openUrlTaskAndMenu',
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
      this.openUrlTaskAndMenu(menu.key);
    },
    getSearchContext() {
      let formContext = this.$refs['ivzBsForm'].getFormContext();
      formContext['type'] = 'search'; // 设置form上下文属于搜索类型
      return formContext;
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
.ivz-bs-search {
  width: 100%;
  position: relative;
  background: #ffffff;
  padding: 0px 0px 16px 0px;
}
.ivz-ibs-form {
  padding: 0px 36px;
}

.ivz-is-fun {
  width: 100%;
  height: 38px;
  line-height: 38px;
  padding: 0px 0px 16px;
  background: #fefefe;
  margin-bottom: 6px;
}
.ivz-isf-btn {
  text-align: center;
}

</style>
