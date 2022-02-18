<template>
    <a-form-model ref="formModelRef" :model="model" :label-col="formConfig.labelCol"
          :layout="formConfig.layout" :wrapper-col="formConfig.wrapperCol" :colon="izColon"
          :labelAlign="formConfig.labelAlign" :validateOnRuleChange="formConfig.validateOnRuleChange"
          :hide-required-mark="formConfig.hideRequiredMark">
        <a-row :align="formConfig.align" :justify="formConfig.justify" :gutter="formConfig.gutter" type="flex">
            <template v-for="col in metas">
                <a-col v-if="viewForm(col)" :span="col.config.span" :key="col.field">
                        <a-form-model-item :label="col.title" :prop="col.field" :ref="col.field"
                           :labelCol="col.config.labelCol" :wrapperCol="col.config.wrapperCol"
                            :rules="col['decorate'].rules" :extra="col.config.extra"
                           :has-feedback="col.config.hasFeedback">
                            <slot v-if="col.formSlot" :name="col.formSlot"></slot>
                            <template v-else>
                                <a-select v-if="col.type=='select'" v-model="model[col.field]" :tokenSeparators="col.config.tokenSeparators"
                                          :allowClear="col.clear" :maxTagCount="col.config.maxTagCount" :placeholder="col.placeholder"
                                          dropdownClassName="iz-select-class" :mode="col.config.mode"
                                          :disabled="disabledHandle(col)" @search="(val) => col.event.search(val, model)" :size="formSize"
                                          @select="(val, option) => col.event.select({value: val, option: option}, model)"
                                          @deselect="(val, option) => col.event.deselect({value: val, option: option}, model)"
                                          @inputKeydown="col.event.inputKeydown(model)" @change="(val)=>changeHandle(val, col)"
                                          :getPopupContainer="col.config.getPopupContainer">
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
                                       @select="(val, node, extra) => col.event.select({value: val, node: node, extra: extra}, model)"
                                               @change="(val)=>changeHandle(val, col)"
                                               :getPopupContainer="col.config.getPopupContainer">
                                </a-tree-select>
                                <a-slider v-else-if="col.type=='slider'" v-model="model[col.field]" :disabled="disabledHandle(col)"
                                          :dots="col.config.dots" :marks="col.config.marks" :min="col.config.min" :max="col.config.max" :step="col.config.step"
                                          :tooltipVisible="col.config.tooltipVisible" :tipFormatter="col.config.tipFormatter" :range="col.config.range"
                                          :blur="col.event.blur" :focus="col.event.focus" @change="(val)=>changeHandle(val, col)"
                                          @afterChange="col.event.afterChange"></a-slider>
                                <a-radio-group v-else-if="col.type=='radio'" v-model="model[col.field]" :options="col.data"
                                       :blur="col.event.blur" :focus="col.event.focus" :name="col.field" :disabled="disabledHandle(col)"
                                               @change="(val)=>changeHandle(val, col)">
                                </a-radio-group>
                                <a-switch v-else-if="col.type=='switch'" v-model="model[col.field]" :size="formSize"
                                      :checkedChildren="col.config.checkedChildren" :unCheckedChildren="col.config.unCheckedChildren"
                                      :loading="col.config.loading" style="margin-bottom:5px" :disabled="disabledHandle(col)"
                                      :blur="col.event.blur" :focus="col.event.focus" @click="col.event.click"
                                          @change="(val)=>changeHandle(val, col)">
                                </a-switch>
                                <a-cascader v-else-if="col.type=='cascade'" :options="col.data" changeOnSelect
                                        v-model="model[col.field]" :loadData="loadData" :placeholder="col.placeholder"
                                        :blur="col.event.blur" :focus="col.event.focus" :disabled="disabledHandle(col)"
                                            @change="(val)=>changeHandle(val, col)"
                                            :getPopupContainer="col.config.getPopupContainer">
                                </a-cascader>
                                <a-checkbox-group v-else-if="col.type=='checkbox'" :options="col.data" :blur="col.event.blur"
                                        :disabled="disabledHandle(col)" :focus="col.event.focus" v-model="model[col.field]"
                                                  @change="(val)=>changeHandle(val, col)">
                                </a-checkbox-group>
                                <a-date-picker v-else-if="col.type=='date'" :size="formSize" v-model="model[col.field]"
                                       :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                                       :disabled-date="col.config.disabledDate" style="width: 100%" :allowClear="col.clear"
                                       :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                                       @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                                       @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}"
                                               @change="(val)=>changeHandle(val, col)"
                                               :getCalendarContainer="col.config.getCalendarContainer">
                                </a-date-picker>
                                <a-range-picker v-else-if="col.type=='dateRange'" :size="formSize" v-model="model[col.field]"
                                        :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                                        :disabled-date="col.config.disabledDate" style="width: 100%" :allowClear="col.clear"
                                        :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                                        @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                                        @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}"
                                        @change="(val)=>changeHandle(val, col)" :valueFormat="col.config.format"
                                                :getCalendarContainer="col.config.getCalendarContainer">
                                </a-range-picker>
                                <a-upload v-else-if="col.type=='upload'" v-model="model[col.field]" :action="col.config.action"
                                          :listType="col.config.listType" :accept="col.config.accept" :directory="col.config.directory"
                                          :data="col.data" :disabled="disabledHandle(col)" :headers="col.config.headers"
                                          :multiple="col.config.multiple" :showUploadList="col.config.showUploadList"
                                          :withCredentials="col.config.withCredentials" :remove="col.config.remove" :name="col.config.name"
                                          :fileList="getFileList(col)" @preview="handlePreview" @change="(e)=>{handleChange(e, col)}">
                                    <div v-if="getFileList(col).length < col.config.limit">
                                        <a-icon type="plus" style="font-size: 26px" />
                                    </div>
                                </a-upload>
                                <a-input-number v-else-if="col.type == 'number'" v-model="model[col.field]" :min="col.config.min"
                                         :disabled="disabledHandle(col)" :max="col.config.max" :step="col.config.step"
                                        :formatter="col.formatter" :precision="col.config.precision" :parser="col.config.parser"
                                        :size="formSize" style="width: 100%" :blur="col.event.blur" :focus="col.event.focus"
                                                @change="(val)=>changeHandle(val, col)">
                                </a-input-number>
                                <a-rate v-else-if="col.type == 'rate'" v-model="model[col.field]" :allowClear="col.clear"
                                        :count="col.config.count" :allowHalf="col.config.allowHalf" :disabled="disabledHandle(col)"
                                        :tooltips="col.config.tooltips" @keydown="(e) => {col.event.keydown(e, model)}"
                                        @hoverChange="(val) => col.event.hoverChange(val, model)" :blur="col.event.blur"
                                        :focus="col.event.focus" @change="(val)=>changeHandle(val, col)">
                                </a-rate>
                                <a-input v-else v-model="model[col.field]" :type="col.type" :size="formSize"
                                         :prefix="col.prefix" :suffix="col.suffix" :disabled="disabledHandle(col)"
                                         :placeholder="col.placeholder" :allowClear="col.clear" @change="(val)=>changeHandle(val, col)"
                                         @pressEnter="(val)=>col.event.pressEnter(val, model, col)" @search="val=>col.event.search(val, model, col)">
                                </a-input>
                            </template>
                        </a-form-model-item>
                </a-col>
            </template>
        </a-row>
        <a-modal :visible="previewFile.url!=null" :footer="null" @cancel="previewCancel">
            <img :alt="previewFile.name" style="width: 100%" :src="previewFile.url" />
        </a-modal>
    </a-form-model>
</template>

<script>
    import {MixBasicModel} from "@/components/mixins/MixBasicModel";
    import Utils from "@/utils/basic.utils";

    export default {
        name: "IvzBasicModel",
        mixins: [MixBasicModel],
        props: {},
        data () {
            return {
                previewFile: {url: null}
            }
        },
        created () { },
        methods: {
            getFileList(col) {
                let fileList = this.model[col.field];
                let list = col.config.FileList;
                if(Utils.isNotBlank(list)) return list;

                if(Utils.isArray(fileList)) {
                    fileList.forEach((url, index)=>{
                        list.push({url: url, uid: -index, name: url, status: 'done'});
                    });
                } else {
                    if(col.config.limit == 1) { // 单张
                        this.$set(this.model, col.field, fileList);
                        if(fileList) {
                            list.push({url: fileList, uid: -1, name: fileList, status: 'done'})
                        }
                    } else { // 多张
                        if(fileList) {
                            fileList.split(',').forEach((url, index)=>{
                                list.push({url: url, uid: -index, name: url, status: 'done'});
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
            handleChange(e, col) {
                let file = e.file;
                let modelElement = this.model[col.field];
                if (file.status == 'uploading') {
                    col.config.FileList = e.fileList
                } else if(file.status == 'done') {
                    let response = file.response;
                    this.$log.debugLog("上传文件", "服务端响应数据", file);

                    let url = response.data[col.config.respField];
                    if(col.config.limit == 1) {
                        this.model[col.field] = url;
                    } else {
                        modelElement.push(url);
                    }
                    col.config.FileList = col.config.FileList.map(item=>{
                        if(item.response) {
                            item['url'] = url;
                        }
                        return item;
                    });
                } else if(file.status == 'removed') {
                    this.model[col.field] = null;
                    Utils.delArrayEle(modelElement, file.url);
                    Utils.delArrayEle(col.config.FileList, file)
                    this.$log.debugLog("上传文件", "移除文件", file);
                } else {
                    file['thumbUrl'] = '';
                    let response = file.response;
                    this.$log.errorLog("上传文件", '上传失败', response);
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
            previewCancel() {
                this.previewFile = {url: null};
            },
        }
    }
</script>

<style scoped>

</style>
