<template>
    <a-form-model ref="formModelRef" :model="model" :label-col="formConfig.labelCol"
          :layout="formConfig.layout" :wrapper-col="formConfig.wrapperCol" :colon="izColon"
          :labelAlign="formConfig.labelAlign" :validateOnRuleChange="formConfig.validateOnRuleChange">
        <a-row :align="formConfig.align" :justify="formConfig.justify" :gutter="formConfig.gutter" type="flex">
            <template v-for="col in metas">
                <a-col v-if="viewForm(col)" :span="col.config.span" :key="col.field">
                    <a-form-model-item :label="col.title" :prop="col.field" :ref="col.field"
                           :labelCol="col.config.labelCol" :wrapperCol="col.config.wrapperCol">
                        <a-select v-if="col.type=='select'" v-model="model[col.field]" :tokenSeparators="col.config.tokenSeparators"
                                  :allowClear="col.clear" :maxTagCount="col.config.maxTagCount" :placeholder="col.placeholder"
                                  dropdownClassName="iz-select-class" :mode="col.config.mode" :size="formSize"
                                  :disabled="disabledHandle(col)" @search="(val) => col.event.search(val, model)"
                                  @select="(val, option) => col.event.select({value: val, option: option}, model)"
                                  @deselect="(val, option) => col.event.deselect({value: val, option: option}, model)"
                                  @inputKeydown="col.event.inputKeydown(model)">
                            <a-select-option v-for="option in col.data" :key="option.value"
                                         :disabled="option.disabled" class="ivz-option-class">
                                {{option.label}}
                            </a-select-option>
                        </a-select>
                        <a-tree-select v-else-if="col.type == 'stree'" v-model="model[col.field]" :allowClear="col.clear"
                               :placeholder="col.placeholder" :treeData="col.data" :showSearch="col.config.showSearch"
                               :dropdownStyle="col.config.dropdownStyle" :disabled="disabledHandle(col)" :size="formSize"
                                :searchPlaceholder="col.config.searchPlaceholder" :multiple="col.config.multiple"
                               :showCheckedStrategy="col.config.showCheckedStrategy" :maxTagCount="col.config.maxTagCount"
                               :treeCheckable="col.config.treeCheckable" :treeDefaultExpandAll="col.config.treeDefaultExpandAll"
                               :treeNodeFilterProp="col.config.valueField" treeNodeLabelProp="label" style="width: 100%"
                               :filterTreeNode="col.config.filterTreeNode" :treeCheckStrictly="col.config.treeCheckStrictly"
                               :blur="col.event.blur" :focus="col.event.focus" @treeExpand="(val) => {col.event.treeExpand(val, model)}"
                               @search="(val) => {col.event.search(val, model)}" :loadData="col.config.loadData"
                               @select="(val, node, extra) => col.event.select({value: val, node: node, extra: extra}, model)">
                        </a-tree-select>
                        <a-radio-group v-else-if="col.type=='radio'" v-model="model[col.field]" :options="col.data"
                               :blur="col.event.blur" :focus="col.event.focus" :name="col.field" :disabled="disabledHandle(col)">
                        </a-radio-group>
                        <a-switch v-else-if="col.type=='switch'" v-model="model[col.field]" :size="formSize"
                              :checkedChildren="col.config.checkedChildren" :unCheckedChildren="col.config.unCheckedChildren"
                              :loading="col.config.loading" style="margin-bottom:5px" :disabled="disabledHandle(col)"
                              :blur="col.event.blur" :focus="col.event.focus" @click="col.event.click">
                        </a-switch>
                        <a-cascader v-else-if="col.type=='cascade'" :options="col.data" changeOnSelect
                                v-model="model[col.field]" :loadData="loadData" :placeholder="col.placeholder"
                                :blur="col.event.blur" :focus="col.event.focus" :disabled="disabledHandle(col)">
                        </a-cascader>
                        <a-checkbox-group v-else-if="col.type=='checkbox'" :options="col.data" :blur="col.event.blur"
                                :disabled="disabledHandle(col)" :focus="col.event.focus" v-model="model[col.field]">
                        </a-checkbox-group>
                        <a-date-picker v-else-if="col.type=='date'" :size="formSize" v-model="model[col.field]"
                               :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                               :disabled-date="col.config.disabledDate" style="width: 100%" :allowClear="col.clear"
                               :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                               @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                               @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-date-picker>
                        <a-month-picker v-else-if="col.type=='month'" :size="formSize" v-model="model[col.field]"
                                :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                                :disabled-date="col.config.disabledDate" style="width: 100%" :allowClear="col.clear"
                                :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                                @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                                @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-month-picker>
                        <a-week-picker v-else-if="col.type=='week'" :size="formSize" v-model="model[col.field]"
                               :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                               :disabled-date="col.config.disabledDate" style="width: 100%" :disabled="disabledHandle(col)"
                               :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                               @openChange="(status) => {col.event.openChange(status, model)}" :allowClear="col.clear"
                               @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-week-picker>
                        <a-range-picker v-else-if="col.type=='dateRange'" :size="formSize" v-model="model[col.field]"
                                :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                                :disabled-date="col.config.disabledDate" style="width: 100%" :allowClear="col.clear"
                                :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                                @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                                @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-range-picker>
                        <a-input-number v-else-if="col.type == 'number'" v-model="model[col.field]" :min="col.config.min"
                                 :disabled="disabledHandle(col)" :max="col.config.max" :step="col.config.step"
                                :formatter="col.formatter" :precision="col.config.precision" :parser="col.config.parser"
                                :size="formSize" style="width: 100%" :blur="col.event.blur" :focus="col.event.focus">
                        </a-input-number>
                        <a-rate v-else-if="col.type == 'rate'" v-model="model[col.field]" :allowClear="col.clear"
                                :count="col.config.count" :allowHalf="col.config.allowHalf" :disabled="disabledHandle(col)"
                                :tooltips="col.config.tooltips" @keydown="(e) => {col.event.keydown(e, model)}"
                                @hoverChange="(val) => col.event.hoverChange(val, model)" :blur="col.event.blur" :focus="col.event.focus">
                        </a-rate>
                        <a-input v-else v-model="model[col.field]" :type="col.type" :size="formSize"
                                 :prefix="col.prefix" :suffix="col.suffix" :disabled="disabledHandle(col)"
                                 :placeholder="col.placeholder" @pressEnter="pressEnter(col)" :allowClear="col.clear">
                        </a-input>
                    </a-form-model-item>
                </a-col>
            </template>
        </a-row>
    </a-form-model>
</template>

<script>
    import {MixBasicModel} from "@/components/mixins/MixBasicModel";

    export default {
        name: "IvzSearchModel",
        mixins: [MixBasicModel],
        props: {
            searchModel: {type: Object, default: () => {}}
        },
        created () {
            this.model = this.searchModel || {};

            // 这边只能合并, searchModel有可能包含从其他页面跳转过来的参数, 不能覆盖
            this.$utils.mergeObject(this.model, this.oriModel);
        },
        methods: {
            pressEnter (col) {
                if (col.event.pressEnter) {
                    col.event.pressEnter(this.searchModel[col.field], this.searchModel, this)
                }

                this.$emit('pressEnter', this.searchModel, col)
            },
            eventHandle (type, val, col) {
                let eventFunction = col.event[type]
                val = val || this.model[col.field]
                eventFunction(val, this.model, this)
            },
            getSearchModel () {
                return this.model
            },
        }
    }
</script>

<style scoped>

</style>
