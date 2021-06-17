<template>
    <a-form class="ivz-search-form" :form="form" :layout="formConfig.layout">
        <a-row :align="formConfig.align" :justify="formConfig.justify" :gutter="formConfig.gutter" type="flex">
            <template v-for="col in searchMetas">
                <a-col v-if="viewForm(col)" :span="col.config.span" :key="col.field">
                    <a-form-item :label="col.title" :extra="col.config.extra" :colon="izColon"
                             :label-col="col.config.labelCol" :wrapper-col="col.config.wrapperCol">
                        <a-select v-if="col.type=='select'" v-decorator="[col.field, col['decorate']]" :size="formSize"
                                  :allowClear="col.clear" :maxTagCount="col.config.maxTagCount" :placeholder="col.placeholder"
                                  dropdownClassName="iz-select-class" :mode="col.config.mode" :tokenSeparators="col.config.tokenSeparators"
                                  :disabled="disabledHandle(col)" @search="(val) => col.event.search(val, model)"
                                  @select="(val, option) => col.event.select({value: val, option: option}, model)"
                                  @deselect="(val, option) => col.event.deselect({value: val, option: option}, model)"
                                  @inputKeydown="col.event.inputKeydown(model)">
                            <a-select-option v-for="option in col.data" :key="option.value"
                                 :disabled="option.disabled" class="ivz-option-class">
                                {{option.label}}
                            </a-select-option>
                        </a-select>
                        <a-tree-select v-else-if="col.type == 'stree'" :allowClear="col.clear" style="width: 100%"
                           v-decorator="[col.field, col['decorate']]" :placeholder="col.placeholder" :treeData="col.data"
                           :dropdownStyle="col.config.dropdownStyle" :disabled="disabledHandle(col)" :showSearch="col.config.showSearch"
                           :multiple="col.config.multiple" :searchPlaceholder="col.config.searchPlaceholder" :size="formSize"
                           :showCheckedStrategy="col.config.showCheckedStrategy" :maxTagCount="col.config.maxTagCount"
                           :treeCheckable="col.config.treeCheckable" :treeDefaultExpandAll="col.config.treeDefaultExpandAll"
                           :treeNodeFilterProp="col.config.valueField" treeNodeLabelProp="label" :loadData="col.config.loadData"
                           :filterTreeNode="col.config.filterTreeNode" :treeCheckStrictly="col.config.treeCheckStrictly"
                           :blur="col.event.blur" :focus="col.event.focus" @treeExpand="(val) => {col.event.treeExpand(val, model)}"
                           @search="(val) => {col.event.search(val, model)}"
                           @select="(val, node, extra) => col.event.select({value: val, node: node, extra: extra}, model)">
                        </a-tree-select>
                        <a-slider v-else-if="col.type=='slider'" v-decorator="[col.field, col['decorate']]" :disabled="disabledHandle(col)"
                              :dots="col.config.dots" :marks="col.config.marks" :min="col.config.min" :max="col.config.max" :step="col.config.step"
                              :tooltipVisible="col.config.tooltipVisible" :tipFormatter="col.config.tipFormatter" :range="col.config.range"
                              :blur="col.event.blur" :focus="col.event.focus"
                              @afterChange="col.event.afterChange"></a-slider>
                        <a-radio-group v-else-if="col.type=='radio'" :options="col.data" :name="col.field" :blur="col.event.blur" :focus="col.event.focus"
                               :disabled="disabledHandle(col)" v-decorator="[col.field, col['decorate']]"></a-radio-group>
                        <a-switch v-else-if="col.type=='switch'" v-decorator="[col.field, col['decorate']]"
                              :checkedChildren="col.config.checkedChildren" :unCheckedChildren="col.config.unCheckedChildren"
                              :loading="col.config.loading" :size="formSize" style="margin-bottom:5px" :disabled="disabledHandle(col)"
                              :blur="col.event.blur" :focus="col.event.focus"
                              @click="col.event.click"></a-switch>
                        <a-cascader v-else-if="col.type=='cascade'" :options="col.data" changeOnSelect
                            v-decorator="[col.field, col['decorate']]" :loadData="loadData" :placeholder="col.placeholder"
                            :blur="col.event.blur" :focus="col.event.focus" :disabled="disabledHandle(col)"></a-cascader>
                        <a-checkbox-group v-else-if="col.type=='checkbox'" :options="col.data" :blur="col.event.blur" :focus="col.event.focus"
                            v-decorator="[col.field, col['decorate']]" :disabled="disabledHandle(col)"></a-checkbox-group>
                        <a-date-picker v-else-if="col.type=='date'" :size="formSize" v-decorator="[col.field, col['decorate']]"
                           :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                           :disabled-date="col.config.disabledDate" style="width: 100%"
                           :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                           @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                           @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-date-picker>
                        <a-month-picker v-else-if="col.type=='month'" :size="formSize" v-decorator="[col.field, col['decorate']]"
                            :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                            :disabled-date="col.config.disabledDate" style="width: 100%"
                            :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                            @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                            @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-month-picker>
                        <a-week-picker v-else-if="col.type=='week'" :size="formSize" v-decorator="[col.field, col['decorate']]"
                           :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                           :disabled-date="col.config.disabledDate" style="width: 100%"
                           :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                           @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                           @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-week-picker>
                        <a-range-picker v-else-if="col.type=='dateRange'" :size="formSize" v-decorator="[col.field, col['decorate']]"
                            :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                            :disabled-date="col.config.disabledDate" style="width: 100%"
                            :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                            @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                            @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                        </a-range-picker>
                        <a-input-number v-else-if="col.type == 'number'" :min="col.config.min" :max="col.config.max" :step="col.config.step"
                            v-decorator="[col.field, col['decorate']]" :disabled="disabledHandle(col)"
                            :formatter="col.formatter" :precision="col.config.precision" :parser="col.config.parser"
                            :size="formSize" style="width: 100%" :blur="col.event.blur" :focus="col.event.focus"></a-input-number>
                        <a-rate v-else-if="col.type == 'rate'" :allowClear="col.clear" :allowHalf="col.config.allowHalf"
                            v-decorator="[col.field, col['decorate']]" :count="col.config.count"
                            :disabled="disabledHandle(col)" :tooltips="col.config.tooltips" @keydown="(e) => {col.event.keydown(e, model)}"
                            @hoverChange="(val) => col.event.hoverChange(val, model)" :blur="col.event.blur" :focus="col.event.focus"></a-rate>
                        <a-input v-else :type="col.type" :size="formSize" :prefix="col.prefix" :suffix="col.suffix"
                             :placeholder="col.placeholder" :disabled="disabledHandle(col)" @pressEnter="pressEnter(col)"
                             v-decorator="[col.field, col['decorate']]">
                        </a-input>
                    </a-form-item>
                </a-col>
            </template>
        </a-row>
    </a-form>
</template>

<script>
    import {MixBasicForm} from '../mixins/MixBasicForm'

    export default {
        name: 'IvzSearchForm',
        mixins: [MixBasicForm],
        components: {},
        props: {
            searchMetas: {type: Array, default: () => {}}, // 表单元数据,
            searchModel: {type: Object, default: () => {}}
        },
        watch: {
            model: {
                handler (newVal, oldVal) {
                    this.form.updateFields() // 搜索表单直接使用双向绑定
                },
                deep: true
            }
        },
        data () {
            return {}
        },
        created () { },
        mounted () {
            this.$utils.assignVueProperty(this.model, this.oriModel, this)
        },
        methods: {
            eventHandle (type, val, col) {
                let eventFunction = col.event[type]
                val = val || this.model[col.field]
                eventFunction(val, this.model, this)
            },
            getSearchModel () {
                return this.model
            },
            onValuesChange (props, values) { // 表单的值同步到model
                this.syncFormToModel(this.model, values)
            },
        }
    }
</script>

<style>
    .ivz-form {

    }
    .ivz-form .ivz-group {
        padding: 0px 8px;
        margin-top: 3px;
    }
    .ivz-form .ivz-group-head {
        margin: 3px 8px 15px;
        padding-bottom: 3px;
        border-bottom: 1px solid #eaedf1;
    }
    .ivz-form .ivz-group-body {
        margin: 0px 24px 0px 8px;
    }
</style>
