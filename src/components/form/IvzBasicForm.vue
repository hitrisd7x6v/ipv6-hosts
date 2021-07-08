<template>
    <a-form class="ivz-form" :form="form" :hide-required-mark="formConfig.hideRequiredMark" :layout="formConfig.layout">
        <template v-for="group in formGroup">
        <div v-show="groupView(group)" :key="group.name" class="ivz-group" :style="group.style">
            <div v-if="group.name" class="ivz-group-head">
                <label style="color: #6eb5ff; font-size: 14px; padding-left: 12px;">{{group.name}}</label>
            </div>
            <div class="ivz-group-body">
                <a-row :align="formConfig.align" :justify="formConfig.justify" :gutter="formConfig.gutter" type="flex">
                    <template v-for="col in group.metas">
                        <a-col v-if="viewForm(col)" :span="col.config.span" :key="col.field">
                            <a-form-item :label="col.title" :label-col="col.config.labelCol" :wrapper-col="col.config.wrapperCol"
                                 :colon="izColon" :has-feedback="col.config.hasFeedback" :extra="col.config.extra">
                                <slot v-if="col.formSlot" :name="col.formSlot"></slot>
                                <template v-else>
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
                                        :multiple="col.config.multiple" :searchPlaceholder="col.searchPlaceholder" :size="formSize"
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
                                        :blur="col.event.blur" :focus="col.event.focus" @click="col.event.click"></a-switch>
                                    <a-cascader v-else-if="col.type=='cascade'" :options="col.data" changeOnSelect :showSearch="col.config.showSearch"
                                        v-decorator="[col.field, col['decorate']]" :loadData="col.config.loadData" :placeholder="col.placeholder" :size="formSize"
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
                                    <a-range-picker v-else-if="col.type=='dateRange'" :size="formSize"
                                        :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                                        :disabled-date="col.config.disabledDate" style="width: 100%" @ok="col.event.ok(model)"
                                        :blur="col.event.blur" :focus="col.event.focus" v-decorator="[col.field, col['decorate']]"
                                        @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                                        @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                                    </a-range-picker>
                                    <a-upload v-else-if="col.type=='upload'" :action="col.config.action" :name="col.config.name"
                                            :listType="col.config.listType" :accept="col.config.accept" :directory="col.config.directory"
                                            :data="col.data" :disabled="disabledHandle(col)" :headers="col.config.headers"
                                            :multiple="col.config.multiple" :showUploadList="col.config.showUploadList"
                                            :withCredentials="col.config.withCredentials" :remove="col.config.remove"
                                              :fileList="getFileList(col)" @preview="handlePreview" @change="(e)=>{handleChange(e, col)}">
                                        <div v-if="getFileList(col).length < col.config.limit">
                                            <a-icon type="plus" style="font-size: 26px" />
                                        </div>
                                    </a-upload>
                                    <a-input-number v-else-if="col.type == 'number'" :min="col.config.min" :max="col.config.max" :step="col.config.step"
                                        v-decorator="[col.field, col['decorate']]" :disabled="disabledHandle(col)"
                                        :formatter="col.formatter" :precision="col.config.precision" :parser="col.config.parser"
                                        :size="formSize" style="width: 100%" :blur="col.event.blur" :focus="col.event.focus"></a-input-number>
                                    <a-rate v-else-if="col.type == 'rate'" :allowClear="col.clear" :allowHalf="col.config.allowHalf"
                                        v-decorator="[col.field, col['decorate']]" :count="col.config.count"
                                        :disabled="disabledHandle(col)" :tooltips="col.config.tooltips" @keydown="(e) => {col.event.keydown(e, model)}"
                                        @hoverChange="(val) => col.event.hoverChange(val, model)" :blur="col.event.blur" :focus="col.event.focus"></a-rate>
                                    <a-textarea v-else-if="col.type == 'textarea'" :placeholder="col.placeholder" :autosize="col.config.autoSize"
                                        v-decorator="[col.field, col['decorate']]" @press-enter="(e)=>col.event.pressEnter(e, model)"
                                        :disabled="disabledHandle(col)" :rows="col.config.rows" :blur="col.event.blur" :focus="col.event.focus"></a-textarea>
                                    <a-input v-else :type="col.type" :size="formSize" :prefix="col.config.prefix" :suffix="col.config.suffix"
                                         :placeholder="col.placeholder" :allowClear="col.clear" v-decorator="[col.field, col['decorate']]"
                                         @press-enter="(e)=>col.event.pressEnter(e, model)" :disabled="disabledHandle(col)"
                                         :blur="col.event.blur" :focus="col.event.focus">
                                    </a-input>
                                </template>
                            </a-form-item>
                        </a-col>
                    </template>
                </a-row>
            </div>
        </div>
        </template>
        <a-modal :visible="previewFile.url!=null" :footer="null" @cancel="previewCancel">
            <img :alt="previewFile.name" style="width: 100%" :src="previewFile.url" />
        </a-modal>
    </a-form>
</template>

<script>
    import moment from 'moment'
    import {MixBasicForm} from '../mixins/MixBasicForm'
    import Utils from "@/utils/basic.utils";

    export default {
    name: 'IvzBasicForm',
    mixins: [MixBasicForm],
    components: {},
    props: {
        formGroup: {type: Array, default: () => {}}, // 表单元数据
    },
    watch: {
        model: {
            handler (newVal, oldVal) {
                if (this.bindType === 'both') { // 如果是双向数据绑定, 则会始终更新
                    this.form.updateFields()
                }
            },
            deep: true
        }
    },
    data () {
        return {
            previewFile: {url: null}
        }
    },
    created () {

    },
    mounted () {
        this.$emit('mountedFinished', this) // 挂载完成事件
    },
    methods: {
        getFileList(col) {
            let fileList = this.model[col.field];
            let list = col.config.FileList;
            if(Utils.isNotBlank(list)) return list;

            if(Utils.isArray(fileList)) {
                fileList.forEach((url, index)=>{
                    list.push({url: url, uid: -index, name: url});
                });
            } else {
                if(col.config.limit == 1) { // 单张
                    this.$set(this.model, col.field, fileList);
                    if(fileList) {
                        list.push({url: fileList, uid: -1, name: fileList})
                    }
                } else { // 多张
                    if(fileList) {
                        fileList.split(',').forEach((url, index)=>{
                            list.push({url: url, uid: -index, name: url});
                        });
                    } else {
                        this.$set(this.model, col.field, []);
                    }
                }

            }
            return list;
        },
        handlePreview(file) {
            this.previewFile = file;
        },
        previewCancel() {
            this.previewFile = {url: null};
        },
        handleChange(e, col) {
            let file = e.file;
            let modelElement = this.model[col.field];
            if (file.status == 'uploading') {
                try {
                    this.getBase64(file.originFileObj).then(resp => {
                        // modelElement.push(resp);
                        col.config.FileList.push({url: resp, uid: col.config.FileList.length + 1, name: 'xx'})
                    })
                } catch (e) {
                    this.$log.warningLog("上传文件警告", "解析base64失败", file);
                }
            } else if(file.status == 'done') {
                let response = file.response;
                this.$log.debugLog("上传文件", "服务端响应数据", response);

                let url = response.data[col.config.respField];
                if(col.config.limit == 1) {
                    this.model[col.field] = url;
                } else {
                    modelElement.push(url);
                }
                col.config.FileList.push({url: url, uid: modelElement.length + 1, name: url})
            } else if(file.status == 'removed') {
                Utils.delArrayEle(modelElement, file.url);
                Utils.delArrayEle(col.config.FileList, file)
            } else {
                this.$msg.warningNotify("上传文件", "文件上传失败")
            }
        },
        getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },
        groupView(group) {
            return group.view(this.model);
        },
        /**
         * 返回当前正在编辑的对象
         * @returns {null|*|undefined}
         */
        getEditModel () {
            return this.model
        },
        getFieldMetaMap() {
            return this.fieldMetaMap;
        },
        onValuesChange (props, values) { // 表单的值同步到model
            if (this.bindType === 'both') { // 双向同步
                this.syncFormToModel(this.model, values)
            } else if (this.bindType === 'void') { // 不同步
                this.syncFormChangeEvent(values, null, this.model)
            }
        },
        /**
         * 触发表单事件
         * @param newModel
         * @param oriModel
         * @param preField
         */
        syncFormChangeEvent (values, field, model) {
            // 用来处理{aa: {bb: {cc: 5}}}嵌套对象的值
            Object.keys(values).forEach(key => {
                if (!field) field = key;
                else field += key;

                let value = values[key];
                let meta = this.fieldMetaMap[field];
                let param = {meta, model: this.model, bind: this.setFieldsValue};
                if (!value) {
                    this.$utils.deepSetValue(key, value, model);
                    meta.event.change(value, param)
                } else if (this.$utils.isArray(value)) { // 如果是数组说明field不是a.b格式
                    if (this.$utils.isDate(meta['type'])) { // 属于日期格式, 需要格式化
                        let temp = [], format = meta['config'].format;
                        value.forEach(item => {
                            if(moment.isMoment(item))
                                temp.push(item.format(format));
                            else temp.push(item);
                        });
                        value = temp
                    }
                    this.$utils.deepSetValue(key, value, model);
                    meta.event.change(value, param)
                } else if (moment.isMoment(value)) { // 属于日期格式, 格式化
                    let format = meta['config'].format;
                    value = value.format(format);
                    this.$utils.deepSetValue(key, value, model);
                    meta.event.change(value, param)
                } else if (value instanceof Object) { // 如果是对象说明field是a.b格式
                    model[key] = model[key] || {};
                    this.syncFormChangeEvent(value, field + '.', model[key]) // 2. 值存在, 继续迭代设置值
                } else {
                    this.$utils.deepSetValue(key, value, model);
                    meta.event.change(value, param)
                }
                field = ''
            })
        },
        // 重置表单值对象
        setEditModel (newModel) {
            this.model = this.$utils.assignProperty({}, newModel);
            this.form.updateFields()
        }
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
        margin: 3px 8px;
        border-bottom: 1px solid #eaedf1;
    }
    .ivz-form .ivz-group-body {
        margin: 8px 16px 0px 28px;
    }
</style>
