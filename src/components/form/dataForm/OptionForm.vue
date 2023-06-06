<template>
  <a-form-item :label="meta.label" :hasFeedback="config.hasFeedback"
       :labelCol="config.labelCol" :wrapperCol="config.wrapperCol"
       :extra="config.extra" :colon="config.colon" :rules="inner.rules"
        :labelAlign="config.labelAlign" :validateFirst="config.validateFirst">
    <a-select v-if="inner.sub == 'select'" v-model:value="model[meta.field]" :maxTagCount="config.maxTagCount"
        dropdownClassName="ivz-select-class" :mode="config.mode" :showSearch="config.showSearch"
        :maxTagTextLength="config.maxTagTextLength" :maxTagPlaceholder="config.maxTagPlaceholder"
        :autoClearSearchValue="config.autoClearSearchValue" :size="config.size" :options="meta.data"
        :defaultActiveFirstOption="config.defaultActiveFirstOption" :allowClear="meta.clear"
        :tokenSeparators="config.tokenSeparators" :getPopupContainer="config.getPopupContainer"
        :disabled="disabled" @search="search" @select="select" @deselect="deselect"
        @inputKeydown="inputKeydown" @change="change" :placeholder="meta.placeholder">
    </a-select>
    <a-cascader v-else-if="inner.sub=='cascade'" :options="meta.data" changeOnSelect
        v-model:value="model[meta.field]" :loadData="config.loadData" :placeholder="placeholder"
        :blur="event.blur" :focus="event.focus" :disabled="disabled(meta)" :size="config.size"
        @change="change" :getPopupContainer="config.getPopupContainer"
        :showSearch="config.showSearch" :default-value="meta.default">
    </a-cascader>
    <a-radio-group v-else-if="inner.sub=='radio'" :options="meta.data" :name="meta.field"
         :blur="event.blur" :focus="event.focus" v-model:value="model[meta.field]"
         :default-value="meta.default" :disabled="disabled" @change="change">
    </a-radio-group>
    <a-checkbox-group v-else-if="inner.sub=='checkbox'" v-model:value="model[meta.field]"
          :options="meta.data" :blur="event.blur" :focus="event.focus"
          :default-value="meta.default" :disabled="disabled" @change="change">
    </a-checkbox-group>
    <a-tree-select v-else-if="inner.sub == 'stree'" :allowClear="meta.clear" style="width: 100%"
         v-model:value="model[meta.field]" :placeholder="meta.placeholder" :treeData="meta.data"
         :dropdownStyle="config.dropdownStyle" :disabled="disabled" :multiple="config.multiple"
         :showSearch="config.showSearch" :getPopupContainer="config.getPopupContainer" :size="config.size"
         :treeExpandedKeys="config.treeExpandedKeys" :searchPlaceholder="config.searchPlaceholder"
         :showCheckedStrategy="config.showCheckedStrategy" :maxTagCount="config.maxTagCount"
         :treeCheckable="config.treeCheckable" :treeDefaultExpandAll="config.treeDefaultExpandAll"
         :treeNodeFilterProp="config.valueField" treeNodeLabelProp="label" :loadData="config.loadData"
         :filterTreeNode="config.filterTreeNode" :treeCheckStrictly="config.treeCheckStrictly"
         :blur="event.blur" :focus="event.focus" @treeExpand="treeExpand" @search="search" @change="change"
         @select="(val, node, extra) => select({value: val, node: node, extra: extra})">
    </a-tree-select>
  </a-form-item>
</template>

<script>
import {commonFormData} from "./FormMixin";

export default {
  name: 'UOptionForm',
  props: ['meta', 'model'],
  mixins: [commonFormData],
  setup(props, ctx) {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
