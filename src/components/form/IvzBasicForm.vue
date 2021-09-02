<template>
    <a-form class="ivz-form" :form="form" :hide-required-mark="formConfig.hideRequiredMark" :layout="formConfig.layout">
        <a-row :align="formConfig.align" :justify="formConfig.justify" :gutter="formConfig.gutter" type="flex">
            <template v-for="col in metas">
                <a-col v-if="viewForm(col)" :span="col.config.span" :key="col.field">
                    <a-form-item :label="col.title" :label-col="col.config.labelCol" :wrapper-col="col.config.wrapperCol"
                                 :colon="izColon" :has-feedback="col.config.hasFeedback" :extra="col.config.extra">
                        <slot v-if="col.formSlot" :name="col.formSlot"></slot>
                        <template v-else>
                            <a-select v-if="col.type=='select'" v-decorator="[col.field, col['decorate']]" :size="formSize"
                                  :allowClear="col.clear" :maxTagCount="col.config.maxTagCount" :placeholder="col.placeholder"
                                  dropdownClassName="iz-select-class" :mode="col.config.mode"
                                  :tokenSeparators="col.config.tokenSeparators" :getPopupContainer="col.config.getPopupContainer"
                                  :disabled="disabledHandle(col)" @search="(val) => col.event.search(val, model, col)"
                                  @select="(val, option) => col.event.select({value: val, option: option}, model, col)"
                                  @deselect="(val, option) => col.event.deselect({value: val, option: option}, model, col)"
                                  @inputKeydown="col.event.inputKeydown(model)" @change="(val)=>changeHandle(val, col)">
                                <a-select-option v-for="option in col.data" :key="option.value"
                                                 :disabled="option.disabled" class="ivz-option-class">
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                            <a-tree-select v-else-if="col.type == 'stree'" :allowClear="col.clear" style="width: 100%"
                                   v-decorator="[col.field, col['decorate']]" :placeholder="col.placeholder" :treeData="col.data"
                                   :dropdownStyle="col.config.dropdownStyle" :disabled="disabledHandle(col)" :multiple="col.config.multiple"
                                   :showSearch="col.config.showSearch" :getPopupContainer="col.config.getPopupContainer" :size="formSize"
                                   :treeExpandedKeys="col.config.treeExpandedKeys" :searchPlaceholder="col.searchPlaceholder"
                                   :showCheckedStrategy="col.config.showCheckedStrategy" :maxTagCount="col.config.maxTagCount"
                                   :treeCheckable="col.config.treeCheckable" :treeDefaultExpandAll="col.config.treeDefaultExpandAll"
                                   :treeNodeFilterProp="col.config.valueField" treeNodeLabelProp="label" :loadData="col.config.loadData"
                                   :filterTreeNode="col.config.filterTreeNode" :treeCheckStrictly="col.config.treeCheckStrictly"
                                   :blur="col.event.blur" :focus="col.event.focus" @treeExpand="(val) => {col.event.treeExpand(val, model, col)}"
                                   @search="(val) => {col.event.search(val, model, col)}" @change="(val)=>changeHandle(val, col)"
                                   @select="(val, node, extra) => col.event.select({value: val, node: node, extra: extra}, model, col)">
                            </a-tree-select>
                            <a-tree v-else-if="col.type == 'tree'" v-model="col.config.checkedKeys" :blockNode="col.config.blockNode"
                                    :checkable="col.config.checkable" :expandedKeys="col.config.expandedKeys" :replaceFields="col.config.replaceFields"
                                    :defaultExpandAll="col.config.defaultExpandAll" :filterTreeNode="col.config.filterTreeNode"
                                    :autoExpandParent="col.config.autoExpandParent" :selectedKeys="col.config.selectedKeys" :loadData="col.config.loadData"
                                    :defaultSelectedKeys="col.config.defaultSelectedKeys" :disabled="disabledHandle(col)" :draggable="col.config.draggable"
                                    :defaultExpandedKeys="col.config.defaultExpandedKeys" :defaultExpandParent="col.config.defaultExpandParent"
                                    :treeData="col.data" :checkStrictly="col.config.checkStrictly" :defaultCheckedKeys="col.config.defaultCheckedKeys"
                                    :loadedKeys="col.config.loadedKeys" :multiple="col.config.multiple" :selectable="col.config.selectable"
                                    :showIcon="col.config.showIcon" :showLine="col.config.showLine" @select="col.event.select"
                                    @dragend="col.event.dragend" @check="(a, k)=>treeCheck(a, model, col, k)" @load="col.event.load"
                                    @dragenter="col.event.dragenter" @dragleave="col.event.dragleave" @dragover="col.event.dragover"
                                    @dragstart="col.event.dragstart" @drop="col.event.drop" @expand="(a, k)=>col.event.expand(a, model, col, k)"
                                    @rightClick="col.event.rightClick">
                            </a-tree>
                            <a-slider v-else-if="col.type=='slider'" v-decorator="[col.field, col['decorate']]" :disabled="disabledHandle(col)"
                                  :dots="col.config.dots" :marks="col.config.marks" :min="col.config.min" :max="col.config.max" :step="col.config.step"
                                  :tooltipVisible="col.config.tooltipVisible" :tipFormatter="col.config.tipFormatter" :range="col.config.range"
                                  :blur="col.event.blur" :focus="col.event.focus" @change="(val)=>changeHandle(val, col)"
                                  @afterChange="col.event.afterChange">
                            </a-slider>
                            <a-radio-group v-else-if="col.type=='radio'" :options="col.data" :name="col.field"
                                   :blur="col.event.blur" :focus="col.event.focus" @change="(val)=>changeHandle(val, col)"
                                   :disabled="disabledHandle(col)" v-decorator="[col.field, col['decorate']]">
                            </a-radio-group>
                            <a-switch v-else-if="col.type=='switch'" v-decorator="[col.field, col['decorate']]"
                                  :checkedChildren="col.config.checkedChildren" :unCheckedChildren="col.config.unCheckedChildren"
                                  :loading="col.config.loading" :size="formSize" style="margin-bottom:5px" :disabled="disabledHandle(col)"
                                  @change="(val)=>changeHandle(val, col)" :blur="col.event.blur" :focus="col.event.focus" @click="col.event.click">
                            </a-switch>
                            <a-cascader v-else-if="col.type=='cascade'" :options="col.data" changeOnSelect :showSearch="col.config.showSearch"
                                v-decorator="[col.field, col['decorate']]" :loadData="col.config.loadData" :placeholder="col.placeholder"
                                :blur="col.event.blur" :focus="col.event.focus" :disabled="disabledHandle(col)" :size="formSize"
                                @change="(val)=>changeHandle(val, col)" :getPopupContainer="col.config.getPopupContainer">
                            </a-cascader>
                            <a-checkbox-group v-else-if="col.type=='checkbox'" v-decorator="[col.field, col['decorate']]"
                                  :options="col.data" :blur="col.event.blur" :focus="col.event.focus"
                                   :disabled="disabledHandle(col)" @change="(val)=>changeHandle(val, col)">
                            </a-checkbox-group>
                            <a-date-picker v-else-if="col.type=='date'" :size="formSize" v-decorator="[col.field, col['decorate']]"
                                   :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                                   :disabled-date="col.config.disabledDate" style="width: 100%"
                                   @change="(val)=>changeHandle(val, col)" :getCalendarContainer="col.config.getCalendarContainer"
                                   :blur="col.event.blur" :focus="col.event.focus" @ok="col.event.ok(model)"
                                   @openChange="(status) => {col.event.openChange(status, model)}" :disabled="disabledHandle(col)"
                                   @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model)}">
                            </a-date-picker>
                            <a-range-picker v-else-if="col.type=='dateRange'" :size="formSize"
                                :format="col.config.format" :show-time="col.config.showTime" :ranges="col.config.ranges"
                                :disabled-date="col.config.disabledDate" style="width: 100%" @ok="col.event.ok(model)"
                                :blur="col.event.blur" :focus="col.event.focus" v-decorator="[col.field, col['decorate']]"
                                @openChange="(status) => {col.event.openChange(status, model, col)}" :disabled="disabledHandle(col)"
                                @panelChange="(val, mode) => {col.event.panelChange({value: val, mode: mode}, model, col)}"
                                @change="(val)=>changeHandle(val, col)" :getCalendarContainer="col.config.getCalendarContainer">
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
                                    :formatter="col.config.formatter" :precision="col.config.precision" :parser="col.config.parser"
                                    :size="formSize" style="width: 100%" :blur="col.event.blur" :focus="col.event.focus"
                                    @change="(val)=>changeHandle(val, col)">
                            </a-input-number>
                            <a-rate v-else-if="col.type == 'rate'" :allowClear="col.clear" :allowHalf="col.config.allowHalf"
                                    v-decorator="[col.field, col['decorate']]" :count="col.config.count" @change="(val)=>changeHandle(val, col)"
                                    :disabled="disabledHandle(col)" :tooltips="col.config.tooltips" @keydown="(e) => {col.event.keydown(e, model, col)}"
                                    @hoverChange="(val) => col.event.hoverChange(val, model, col)" :blur="col.event.blur" :focus="col.event.focus">
                            </a-rate>
                            <a-textarea v-else-if="col.type == 'textarea'" :placeholder="col.placeholder" :autosize="col.config.autoSize"
                                        v-decorator="[col.field, col['decorate']]" @press-enter="(e)=>col.event.pressEnter(e, model, col)"
                                        @change="(val)=>changeHandle(val, col)" :disabled="disabledHandle(col)"
                                        :rows="col.config.rows" :blur="col.event.blur" :focus="col.event.focus">
                            </a-textarea>
                            <a-input v-else :type="col.type" :size="formSize" :prefix="col.config.prefix" :suffix="col.config.suffix"
                                     :placeholder="col.placeholder" :allowClear="col.clear" v-decorator="[col.field, col['decorate']]"
                                     :disabled="disabledHandle(col)" @change="(val)=>changeHandle(val, col)"
                                     @pressEnter="(val)=>col.event.pressEnter(val, model, col)" @search="val=>col.event.search(val, model, col)">
                            </a-input>
                        </template>
                    </a-form-item>
                </a-col>
            </template>
        </a-row>
        <a-modal :visible="previewFile.url!=null" :footer="null" @cancel="previewCancel">
            <img :alt="previewFile.name" style="width: 100%" :src="previewFile.url" />
        </a-modal>
    </a-form>
</template>

<script>
    import {MixBasicForm} from '../mixins/MixBasicForm'
    import Utils from "@/utils/basic.utils";

    export default {
    name: 'IvzBasicForm',
    mixins: [MixBasicForm],
    data () {
        return {
            previewFile: {url: null}
        }
    },
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

<style>

</style>
