<template>
    <div class="ivz-view-basic" style="width: 100%; height: 100%;">
        <div class="ivz-vbd-opera" @click="activeHandle">
            <div class="ivz-do-item ivz-do-left">
                <div style="background: #1296ff; color: #ffffff; padding: 0px 10px; height: 30px;">
                    <ivz-icon type="iz-icon-container-default" />
                    <span style="vertical-align: 0.08em"> 默认视图 (IvzBasicView)</span>
                </div>
                <div style="color: #afafaf; font-size: 13px; height: 28px; line-height: 24px">
                    注: <span style="font-size: 12px">
                    1. 输入的值将作为默认值
                </span>
                </div>
            </div>
            <div class="ivz-do-item ivz-do-right">
                <ul style="list-style: none; margin: 0px; padding: 0px;">
                    <li style="float: left; width: 212px;">
                        <a-form-model-item label="列数" :label-col="{span: 5}" :wrapper-col="{span: 19}">
                            <a-slider v-model="model.column" @change="columnHandle" style="width: 128px;"
                                  :min="1" :max="4" :step="1" :marks="{1: '1列', 2: '2', 3: '3', 4: '4列'}" />
                        </a-form-model-item>
                    </li>
                    <li style="float: left; width: 256px;">
                        <a-form-model-item label="列布局" :label-col="{span: 5}" :wrapper-col="{span: 19}">
                            <a-slider v-model="model.formCol" :range="true" @change="formColHandle"
                                  :min="3" :max="21" :step="1" :marks="{3: '标签', 6: '6', 12: '12', 18: '18', 21: '表单'}"/>
                        </a-form-model-item>
                    </li>
                </ul>
            </div>
        </div>
        <a-row class="ivz-vd-body ivz-vbd-body" style="width: 100%; height: 100%" :gutter="global.gutter">
            <a-form-model style="width: 100%; height: 100%" :layout="model.layout"
                :labelCol="model.labelCol" :wrapperCol="model.wrapperCol" :labelAlign="model.align">
                <draggable :list="metas" :options="options" group="item" @add="onAddHandle"
                           :animation='200' :move="onMove" style="width: 100%; height: 100%; overflow-y: auto;">
                    <template v-for="meta in metas">
                        <a-col v-if="meta.type=='group'" span="24">
                            <ivz-group-item :global="global" :key="meta.id" :meta="meta" :data-id="meta.id"/>
                        </a-col>
                        <template v-else-if="meta.type=='modal'" />
                        <ivz-form-item v-else :global="global" type="table" :key="meta.id"
                            :meta="meta" :data-id="meta.id" @delMetaItem="delMetaItem" />
                    </template>
                </draggable>
            </a-form-model>
        </a-row>
        <div class="ivz-vd-footer">
            <ivz-modal-item v-for="meta in modalMetas" class="ivz-vdf-item" ref="modalItem"
                    :key="meta.id"  :meta="meta" :global="global" @remove="removeModalHandle" />
        </div>
        <ivz-preview-view ref="previewRef">
            <ivz-basic-view :metas="viewConfig.metas" :config="viewConfig.config"
                :search-metas="viewConfig.searchMetas"></ivz-basic-view>
            <template v-if="modalConfigs && modalConfigs.length > 0">
                <ivz-modal-form v-for="meta in modalConfigs" :metas="meta.metas" :ref="meta.id"
                    :save-meta="{}" :title="meta.title" :width="meta.width" :config="meta.config" />
            </template>
        </ivz-preview-view>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import PreviewUtils from "@/utils/preview.utils";
    import EditMetas from "@/components/online/EditMetas";
    import PreviewView from '@/components/online/preview.data';
    import IvzFormItem from "@/components/online/item/IvzFormItem";
    import IvzGroupItem from "@/components/online/item/IvzGroupItem";
    import IvzPreviewView from "@/components/online/preview/IvzPreviewView";
    import IvzModalItem from "@/components/online/item/IvzModalItem";
    export default {
        name: "IvzBasicViewContainer",
        components: {
            IvzModalItem,
            IvzPreviewView,
            draggable,
            IvzGroupItem,
            IvzFormItem
        },
        props: ['metas', 'global', 'view'],
        data() {
            return {
                model: {},
                modalMetas: [],
                viewConfig: {},
                modalConfigs: [],
                options: {
                    type: 'container',
                    ghostClass: 'ghost',
                    // forceFallback: true,
                    chosenClass: 'active',
                    dragClass: 'drag-handle'
                }
            }
        },
        created() {
            this.activeHandle();
            this.$page.menu.name="IvzBasicView预览"
        },
        methods: {
            getSpan(meta) {
                if(meta.model) return meta.model.span || this.global.span;
                else return this.global.span;
            },
            onMove(evt) {
                let form = evt['draggedContext']['element'];
                let to = evt['relatedContext']['component'];

                let options = to['options'];
                if(form.type == 'group') { // 组不能拖拽到组

                    if(options.type == 'group') return false;
                } else { // 项拖拽到组
                    if(options.type == 'group') {

                    }
                }
            },
            onAddHandle(e) {
                if(this.metas) {
                    this.metas.forEach((meta, index) => {
                        if(meta.type == 'modal') {
                            this.modalMetas.push(meta);
                            this.metas.splice(index, 1);
                        }
                    });
                }
            },
            columnHandle(val) {
                this.model.column=val;
                this.global.span = 24 / val;
            },
            formColHandle(val) {
                if(val[0] + val[1] > 24) return;
                this.model.labelCol = {span: val[0]};
                this.model.wrapperCol = {span: val[1]};
            },
            delMetaItem(meta) {
                this.activeHandle();
                this.global.delItem(meta);
            },
            activeHandle() {
                this.global.active = this.view.id;
                this.model = EditMetas.IvzBasicModel;

                this.global.editModel = this.model;
                this.global.editMetas = EditMetas[this.view.type];
            },
            removeModalHandle(meta) {
                this.modalMetas.forEach((item, index) => {
                    if(item == meta) {
                        let model = item.model;
                        this.modalMetas.splice(index, 1);
                        this.$page.delActionMeta(model['permId']);
                    }
                })
            },
            handleSearchMetas(editMeta, searchMetas) {
                if(!editMeta.isSearch) return;

                let dict=editMeta['dict'], url = editMeta['url'], data = editMeta['data'];
                let meta = {
                    type: editMeta.type,
                    field: editMeta.field,
                    title: editMeta.title,
                    config: {}
                };

                if(url) meta['url'] = url;
                if(data) meta['data'] = data;
                if(dict) meta['dict'] = dict;
                searchMetas.push(meta);
            },
            viewPreview(type) {
                this.viewConfig = this.resolverViewConfig();
                this.viewConfig.htmlCode = this.resolverPageTemplate();
                this.viewConfig.sqlScript = EditMetas.resolverSqlScript(this.metas, this.model);

                this.$refs['previewRef'].open(type, this.viewConfig);
            },
            resolverViewConfig() {
                let viewConfig = {
                    metas: [], searchMetas: [],
                    config: {
                        form: {
                            layout: this.model.layout,
                            column: this.model.column,
                            addTitle: this.model.addTitle,
                            editTitle: this.model.editTitle
                        },
                        table: {
                            rowKey: this.model['keyField']
                        },
                        detail: {

                        }
                    },
                    data: [],
                    htmlCode: null,
                    sqlScript: null,
                    view: this.model
                };
                let vue = this;
                let model = this.model;
                function doResolverItems(metas, viewMetas) {
                    metas.forEach(meta => {
                        if(meta.type == 'modal') return;

                        if(meta.type == 'group') {
                            let groupMetas = EditMetas.resolverGroupToMeta(meta.model, vue.global);

                            viewMetas.push(groupMetas);
                            doResolverItems(meta.children, groupMetas.metas || groupMetas.children);
                        } else {
                            let viewMeta = EditMetas.resolverItemToMeta(meta.model, vue.global);
                            viewMetas.push(viewMeta);

                            if(meta.model.isSearch) {
                                let searchMeta = EditMetas.resolverCommonItemToMeta(meta.model, vue.global);
                                viewConfig.searchMetas.push(searchMeta);
                            }

                            viewMeta['labelCol'] = model.labelCol;
                            viewMeta['wrapperCol'] = model.wrapperCol;

                        }
                    });

                    return viewConfig;
                }

                // 解析模态框配置
                this.handleModalConfig();
                // 处理表格配置
                this.handleTableConfig(viewConfig.config.table, this.model);

                // 解析元数据
                doResolverItems(this.metas, viewConfig.metas);
                viewConfig.metas.push({title: '操作', field: 'action', type: 'action'}); // 增加操作元数据

                // 创建需要模拟的数据
                PreviewView.createMockData(this.metas, this.model);
                return viewConfig;
            },
            // 解析模态框配置
            handleModalConfig() {
                let modalConfig = [];
                let modalItemRefs = this.$refs['modalItem'];
                if(modalItemRefs && modalItemRefs.length >0) {
                    modalItemRefs.forEach(modalItem => {
                        let resolverModalConfig = modalItem.resolverModalConfig();
                        modalConfig.push(resolverModalConfig);

                        let modalMeta = modalItem.meta;
                        let modalModel = modalItem.model;

                        let vue = this;
                        this.$page.addActionMeta(modalModel['permId']
                            , {label: modalModel.permTitle, position: modalModel.position
                                , callBack: (model) => {
                                    return new Promise(() => {
                                        let id = modalMeta.id;
                                        let modalFormRef = vue.$refs[id][0];
                                        modalFormRef.open(model);
                                    })
                                }
                        });
                    })
                }
                this.modalConfigs = modalConfig;
            },
            handleTableConfig(config, model) { // 处理表格配置
                if(model['selection'] != 'none') {
                    this.$set(config, 'selection', {
                        type: model['selection']
                    });
                }
                config['bordered'] = model['isBorder'];
                config['fixedHeight'] = model['fixedHeight'];
                if(model['isPage']) config['pagination'] = {}
            },
            resolverModalTemplates() {
                let modalTemplates = '';
                let modalItemRefs = this.$refs['modalItem'];
                if(modalItemRefs && modalItemRefs.length >0) {
                    modalItemRefs.forEach(modalItem => {
                        modalTemplates += modalItem.resolverHtmlTemplate() + '\r\n\t\t\t';
                    })
                }
                return modalTemplates;
            },
            resolverModalConfig() {
                let pageConfig = {};
                let modalItemRefs = this.$refs['modalItem'];
                if(modalItemRefs && modalItemRefs.length >0) {
                    modalItemRefs.forEach(modalItem => {
                        let permId = modalItem.getPermId();

                        // 获取功能模态框配置
                        let config = modalItem.resolverJavaScript();

                        // 权限标识作为对象key
                        pageConfig[permId] = config;
                    })
                }

                return pageConfig;
            },
            resolverPageTemplate() {
                let modalTemplates = this.resolverModalTemplates();

                let metasTemplate = PreviewUtils.resolverPageMetasTemplate(this.viewConfig.metas);
                let pageConfigTemplate = PreviewUtils.resolverPageConfigTemplate(this.viewConfig.config);
                let searchMetasTemplate = PreviewUtils.resolverPageSearchMetasTemplate(this.viewConfig.searchMetas);

                let modalConfigTemplate = "", createdMethodTemplate = "";
                let modalConfig = this.resolverModalConfig();
                Object.keys(modalConfig).forEach(permId => {
                    let obj = modalConfig[permId];
                    createdMethodTemplate += PreviewUtils.resolverPermCallbackTemplate(permId);
                    modalConfigTemplate += (permId + ":" + PreviewUtils.resolverPermConfigTemplate(obj));
                });

let htmlCode = `<html lang="zh-CN">
    <!--省略<head>-->
    <body>
        <div id="app">
            <ivz-basic-view :metas="metas" :search-metas="searchMetas" :config="config"></ivz-basic-view>
            ${modalTemplates}
        </div>
        <!--省略umd脚本-->
        <script type="text/javascript">
            let vue = new Vue({
                el: "#app",
                data: function() {
                    return {
                        metas: ${metasTemplate},
                        searchMetas: ${searchMetasTemplate},
                        config: ${pageConfigTemplate},
                        ${modalConfigTemplate}
                    }
                },
                created: function() {
                    ${createdMethodTemplate}
                },
                methods: {

                }
            });
        <\/script>
    </body>
</html>
`;
                return htmlCode;
            }
        }
    }
</script>

<style>
    .drag-handle {
        cursor: move;
    }
    .ivz-view-basic {
        display: flex;
        display: -ms-flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .ivz-view-basic .ant-modal-wrap {
        position: absolute!important;
    }
    .ivz-view-basic .ant-modal-body {
        padding: 12px!important;
    }
    .ivz-vbd-opera {
        width: 100%;
        height: 52px;
        cursor: pointer;
        min-height: 52px;
        padding-right: 5px;
        margin-bottom: 5px;
        background: #ffffff;
        box-shadow: 0px 2px 5px 1px #efefef;
    /*border-bottom: 1px solid #e0e0e0;*/
    }
    .ivz-vbd-body {

    }
    .ivz-vd-footer {
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: 32px;
        margin: 0px;
        padding: 0px;
        list-style: none;
        position: absolute;
        background: #ffffff;
        border-top: 1px dashed #cccccc;
    }
    .ivz-vdf-item {
        float: left;
        height: 32px;
        line-height: 32px;
    }
    .ivz-do-item {
        height: 32px;
        padding: 0px 5px;
        line-height: 32px;
        -webkit-border-radius: 3px;
    }
    .ivz-do-left {
        float: left;
        height: 100%;
        /*padding: 0px 8px;*/
    }
    .ivz-do-slider {
        float: right;
    }
    .ivz-do-right {
        float: right;
        min-width: 256px;
    }
    .ivz-do-tag {
        font-size: 16px;
    }
    .ghost {
        opacity: 1;
        background: lightcyan!important;
    }
</style>
