<template>
    <div class="ivz-view-basic" @click="activeHandle" style="width: 100%; height: 100%;">
        <div class="ivz-vbd-opera">
            <div class="ivz-do-item ivz-do-left">
                <div style="background: #1296ff; color: #ffffff; padding: 0px 10px; height: 30px; line-height: 30px">
                    <ivz-icon type="iz-icon-container-default" />
                    <span style="vertical-align: 0.08em"> 默认视图 (IvzBasicView)</span>
                </div>
                <div style="color: #afafaf; font-size: 13px; height: 28px; line-height: 22px">
                    注: <span style="font-size: 12px">1. 输入的值将作为默认值</span>
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
            <a-form-model style="width: 100%; height: 100%" :layout="model.layout" :model="model" ref="viewModelRef"
                :labelCol="model.labelCol" :wrapperCol="model.wrapperCol" :labelAlign="model.align">
                <draggable :list="metas" :options="options" group="item" @add="onAddHandle"
                           :animation='200' :move="onMove" style="width: 100%; height: 100%; overflow-y: auto;">
                    <template v-for="meta in metas">
                        <ivz-group-item v-if="meta.type=='group'" :global="global"
                            :key="meta.id" :ref="meta.id" :meta="meta" :view="model" :data-id="meta.id"/>
                        <template v-else-if="meta.type=='modal'" />
                        <ivz-form-item v-else :global="global" type="table" :key="meta.id"
                            :meta="meta" :ref="meta.id" :data-id="meta.id" :view="model" @delMetaItem="delMetaItem" />
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
                    :save-meta="{}" :key="meta.id" :title="meta.title" :width="meta.width" :config="meta.config" />
            </template>
        </ivz-preview-view>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import IvzFormItem from "@/components/online/item/IvzFormItem";
    import IvzGroupItem from "@/components/online/item/IvzGroupItem";
    import {MixinViewConfig} from "@/components/online/MixinViewConfig";
    import IvzPreviewView from "@/components/online/preview/IvzPreviewView";
    import IvzModalItem from "@/components/online/item/IvzModalItem";
    import PreviewUtils from "@/utils/preview.utils";

    export default {
        name: "IvzBasicViewContainer",
        mixins: [MixinViewConfig],
        components: {
            IvzModalItem,
            IvzPreviewView,
            draggable,
            IvzGroupItem,
            IvzFormItem
        },
        created() {
            this.$page.menu.name="IvzBasicView预览";
        },
        methods: {
            getViewType() {
                return this.global.viewType[0];
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
                    modalConfigTemplate += (permId + ":" + PreviewUtils.resolverPermConfigTemplate(obj) + ",\n\t\t\t\t\t");
                });

                let htmlCode = `<html lang="zh-CN">
    <head>
        <title></title>
    </head>
    <body>
        <div id="app">
            <ivz-basic-view :metas="metas" :search-metas="searchMetas" :config="config"></ivz-basic-view>
            ${modalTemplates}
        </div>
    </body>
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
        height: 38px;
        padding: 0px 5px;
        line-height: 38px;
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
