<template>
  <div class="ivz-search ivz-bread-search">
    <UForm class="ivz-search-form" ref="ivzBsForm" layout="inline">
      <template #default="{model}">
        <slot :model="model"></slot>
      </template>
    </UForm>
    <a-row class="ivz-is-fun" align="middle">
      <a-col class="ivz-isf-bru" span="12">
        <slot name="func"></slot>
      </a-col>
      <a-col style="text-align: right" span="12">
        <ASpace>
          <ATooltip placement="top" title="列管理">
            <a-dropdown v-model:visible="visible" :trigger="['click']"
                        placement="bottom" :overlayStyle="{minWidth: '160px'}">
              <AButton type="dashed">
                <template #icon>
                  <UnorderedListOutlined :style="{fontSize: '16px'}" />
                </template>
                <DownOutlined />
              </AButton>
              <template #overlay>
                <AMenu>
                  <AMenuItem>
                    <ACheckbox v-model:checked="checkedModel.checkedAll" @change="checkedModel.onChange"
                               :indeterminate="checkedModel.indeterminate" />
                    <a style="float: right; color: rgba(30,144,255,0.89)" @click="checkedModel.reset()">重置</a>
                  </AMenuItem>
                  <AMenuDivider />
                  <template v-for="column in columnsWrapper" :key="column.field">
                    <AMenuItem>
                      <ACheckbox v-model:checked="column.checked"
                                 @change="()=>checkedModel.childChange(column)" /> {{column.title}}
                    </AMenuItem>
                  </template>
                </AMenu>
              </template>
            </a-dropdown>
          </ATooltip>
          <ATooltip placement="top" title="粘表头">
            <AButton type="dashed">
              <template #icon>
                <UIcon type="iz-icon-fixed" :style="{fontSize: '16px'}" @click="sticky"/>
              </template>
            </AButton>
          </ATooltip>
          <a-tooltip placement="top" title="全屏">
            <AButton type="dashed">
              <template #icon>
                <FullscreenOutlined :style="{fontSize: '16px'}" @click="fullScreen"/>
              </template>
            </AButton>
          </a-tooltip>
        </ASpace>
      </a-col>
    </a-row>
  </div>

</template>

<!-- 搜索 -->
<script>
import {DownOutlined, FullscreenOutlined, HomeFilled, UnorderedListOutlined, SearchOutlined} from '@ant-design/icons-vue'
import UForm from "@/components/form/basic/Form";
import {inject, provide, reactive, ref} from "vue";
import {FuncContextKey, LinkViewContextKey, ViewContextKey} from "@/utils/ProvideKeys";
import {SearchContext, TableContext} from "@/components/view/Context";
import CoreConsts from "@/components/CoreConsts";

export default {
  name: "UBreadSearch",
  props: {
    tid: {type: String, default: null},
    uid: {type: String, required: true, default: CoreConsts.DefaultSearchUid}
  },
  components: {UForm, DownOutlined, HomeFilled, FullscreenOutlined, UnorderedListOutlined, SearchOutlined},
  setup({uid}) {
    /**
     * @type {LinkContext}
     */
    let linkContext = inject(LinkViewContextKey);
    let searchContext = new SearchContext(linkContext);

    if(linkContext) {
        searchContext.uid = uid;
        linkContext.addChildrenContext(searchContext);
    }

    let columns = ref([]);
    let columnsWrapper = reactive([]);
    let checkedModel = reactive({
      checkedAll: true,
      indeterminate: false,
      reset() {
        checkedModel.checkedAll = true;
        checkedModel.indeterminate = false;
        columnsWrapper.forEach(columnWrapper => {
          if(!columnWrapper.checked) {
            columnWrapper.checked = true;
            checkedModel.addColumn(columnWrapper);
          }
        })
      },
      onChange: (e) => {
        if(checkedModel.checkedAll) {
          columnsWrapper.forEach(columnWrapper => {
            if(!columnWrapper.checked) {
              columnWrapper.checked = true
              checkedModel.addColumn(columnWrapper);
            }
          });
        } else {
          columnsWrapper.forEach(item => {
            item.checked = false
          });

          columns.value.splice(0, columns.value.length - 1);
        }
        checkedModel.indeterminate = false;
      },
      addColumn: (columnWrapper) => {
        if(columnWrapper.index == 0) {
          columns.value.splice(0, 0, columnWrapper.column); return;
        }

        for(let i= columnWrapper.index - 1; i>=0; i--) {
          let prevColumn = columnsWrapper[i];
          if(prevColumn.checked) {
            for(let index=0; index < columns.value.length; index++) {
              let column = columns.value[index];
              if(column == prevColumn.column) {
                columns.value.splice(index + 1, 0, columnWrapper.column); return;
              }
            }

            break;
          } else if(i == 0) {
            columns.value.splice(0, 0, columnWrapper.column); return;
          }
        }
      },
      childChange: (columnWrapper) => {
        if(!columnWrapper.checked) {
          columns.value.forEach((item, index) => {
            if(columnWrapper.column == item) {
              columns.value.splice(index, 1);
            }
          })
        } else {
          checkedModel.addColumn(columnWrapper);
        }
        let checkedList = columnsWrapper.filter(item => item.checked);
        if(checkedList.length == columnsWrapper.length) {
          checkedModel.checkedAll = true;
          checkedModel.indeterminate = false;
        } else if(checkedList.length == 0) {
          checkedModel.checkedAll = false;
          checkedModel.indeterminate = false;
        } else {
          checkedModel.indeterminate = checkedList.length > 0
              && checkedList.length < columnsWrapper.length;
        }
      }
    });
    let visible = ref(false);
    provide(FuncContextKey, searchContext);
    return {searchContext, visible, checkedModel, columns, columnsWrapper, linkContext}
  },
  created() {
    this.searchContext['getFormContext'] = this.getFormContext;
  },
  mounted() {
    let tableContext = this.getLinkContext().getChildrenContext(this.tid);
    if(tableContext instanceof TableContext) {
      this.columns = tableContext.getColumns();
      this.columns.filter((item, index) => index < this.columns.length - 1)
        .forEach((column, index) => {
          this.columnsWrapper.push({checked: true, index, field: column.field, title: column.title, column});
        });
    }
  },
  methods: {
    /**
     * 表头和滚动条
     */
    sticky() {
      let tableContext = this.getLinkContext().getChildrenContext(this.tid);
      if(tableContext instanceof TableContext) {
        tableContext.setSticky(true)
      } else {
        this.$emit('sticky', this);
      }
    },
    fullScreen() {

    },

    /**
     * @return {LinkContext}
     */
    getLinkContext() {
      return this.linkContext;
    },
    /**
     * @return {SearchContext}
     */
    getSearchContext() {
      return this.searchContext;
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
  padding-top: 12px;
  position: relative;
  background: #ffffff;
}
.ivz-search-form {
  margin-bottom: 8px;
}
.ivz-bread-search .ivz-is-fun {
  width: 100%;
  height: 38px;
  padding: 0px;
  line-height: 38px;
  background: #fefefe;
}

.search-ibs-item {
  margin-right: 16px;
}
.search-ibs-item:hover{
  cursor: pointer;
}
.search-ibs-item:active {
  color: #3399ff;
}
</style>
