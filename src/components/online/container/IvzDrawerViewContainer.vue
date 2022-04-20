<template>
    <div class="ivz-oc-drawer" @click="activeHandle">
        <a-drawer placement="right" :width="model.drawerRate" :height="model.drawerRate"
                  :maskClosable="model.maskClosable" :mask="model.mask" :closable="false"
                  :visible="true" :placement="model.placement" getContainer=".ivz-oc-drawer">
            <div class="ivz-do-item" slot="title">
                <ul style="list-style: none; margin: 0px; padding: 0px;">
                    <li style="float: left; width: 128px;">
                        抽屉视图
                    </li>
                    <li style="float: right; width: 138px;">
                        <a-form-model-item label="宽/高" :label-col="{span: 8}" :wrapper-col="{span: 12}">
                            <a-input-number v-model="model.drawerRate" :min="180" :max="960"
                                    :step="1" style="width: 68px;" @change="rateHandle"/>
                        </a-form-model-item>
                    </li>
                    <li style="clear: both;"></li>
                </ul>
            </div>
            <a-row class="ivz-vd-body ivz-od-body" style="width: 100%; height: 100%" :gutter="8">
                <a-form-model style="width: 100%; height: 100%" :layout="model.layout" :labelAlign="model.align"
                              :labelCol="model.layout == 'horizontal' ? model.labelCol : null"
                              :wrapperCol="model.layout == 'horizontal' ? model.wrapperCol : null">
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
            <ivz-preview-view ref="previewRef">
                <ivz-drawer-view :metas="viewConfig.metas" :config="viewConfig.config"
                         style="z-index: 1020" :search-metas="viewConfig.searchMetas"/>
                <template v-if="modalConfigs && modalConfigs.length > 0">
                    <ivz-modal-form v-for="meta in modalConfigs" :metas="meta.metas" :ref="meta.id"
                        :save-meta="{}" :title="meta.title" :width="meta.width" :config="meta.config" />
                </template>
            </ivz-preview-view>
        </a-drawer>
        <div class="ivz-od-footer">
            <ivz-modal-item v-for="meta in modalMetas" class="ivz-vdf-item" ref="modalItem"
                :key="meta.id"  :meta="meta" :global="global" @remove="removeModalHandle" />
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import {MixinViewConfig} from "../MixinViewConfig"
    import IvzFormItem from "@/components/online/item/IvzFormItem";
    import IvzGroupItem from "@/components/online/item/IvzGroupItem";
    import IvzPreviewView from "@/components/online/preview/IvzPreviewView";
    import IvzModalItem from "@/components/online/item/IvzModalItem";
    import EditMetas from "@/components/online/EditMetas";
    import PreviewUtils from "@/utils/preview.utils";
    export default {
        name: "IvzDrawerViewContainer",
        mixins: [MixinViewConfig],
        components: {
            draggable, IvzFormItem, IvzGroupItem, IvzPreviewView, IvzModalItem
        },
        props: ['metas', 'global'],
        data() {
            return {
                options: {
                    ghostClass: 'ghost',
                    // forceFallback: true,
                    chosenClass: 'active',
                    dragClass: 'drag-handle'
                }
            }
        },
        created() {
            this.$page.menu.name="IvzDrawerView预览"
        },
        updated() { },
        methods: {
            rateHandle(val) {
                let placement = this.model['placement'];
                if(placement == 'right') {
                    if(val < 360) this.model['drawerRate'] = 360
                } else {
                    if(val < 280) this.model['drawerRate'] = 280
                }
            },
            activeHandle() {
                this.global.active = this.view.id;
                this.model = EditMetas.IvzDrawerModel;

                this.global.editModel = this.model;
                this.global.editMetas = EditMetas[this.view.type];
            },
            getPageConfig() {
                return {
                    form: {
                        column: this.model.column,
                        layout: this.model.layout,
                        length: this.model.drawerRate,
                        addTitle: this.model.addTitle,
                        placement: this.model.placement,
                        editTitle: this.model.editTitle,
                        maskClosable: this.model.maskClosable
                    },
                    table: {
                        rowKey: this.model['keyField']
                    },
                    detail: {},
                    search: {}
                }
            },
            resolverPageTemplate() {
                let model = this.model;
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
                let placement = this.model['placement'] == 'top' ? ' placement="top"' : "";
                let maskClosable = this.model['maskClosable'] ? "" : ' :maskClosable="flase"'
                let htmlCode = `<html lang="zh-CN">
    <head>
        <title>${model.comment}</title>
        ${PreviewUtils.UmdCss}
    </head>
    <body>
        <div id="app">
            <ivz-drawer-view :metas="metas" :search-metas="searchMetas" :config="config"${placement}${maskClosable}></ivz-drawer-view>
            ${modalTemplates}
        </div>
    </body>
    ${PreviewUtils.UmdJs}
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
    .ivz-oc-drawer .ant-drawer{
        position: absolute;
    }
    .ivz-oc-drawer .ant-drawer-header {
        padding: 10px 16px;
    }
    .ivz-oc-drawer .ant-drawer-body {
        width: 100%;
        height: 100%;
    }
    .ivz-oc-drawer .ant-modal-wrap, .ivz-oc-drawer .ant-modal-mask {
        position: absolute;
    }
    .ivz-drawer-view .ant-drawer {
        position: absolute;
    }
    .ivz-od-footer {
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: 32px;
        margin: 0px;
        padding: 0px;
        z-index: 1008;
        list-style: none;
        position: absolute;
        background: #ffffff;
        border-top: 1px dashed #cccccc;
    }
    .ivz-odd-opera {

    }
    .ivz-oo-left {
        float: left;
    }
    .ivz-ocd-drag {
        width: 100%;
        min-height: 320px;
    }
</style>
