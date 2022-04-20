<template>
    <div class="ivz-modal-item" @click.stop="visibleHandle">
        <div class="ivz-mi-title">
            <a-button :type="visible ? 'primary' : 'dashed'" size="small">
                {{model.permTitle ? model.permTitle : '功能点'}}
                <label @click="removeHandle">&nbsp;<a-icon type="close-circle" /></label>
            </a-button>
        </div>
        <a-modal :mask="model.mask" :centered="model.centered" :bodyStyle="{height: model.length[0]+'px'}"
                 :visible="visible" @cancel="cancelHandle" :getContainer="getModalContainer"
                 :closable="model.closable" :maskClosable="model.maskClosable" :width="model.length[1]">
            <div slot="title"  @click.stop="visibleHandle">
                {{model.title}}
            </div>
            <div style="width: 100%; height: 100%;"  @click.stop="visibleHandle">
                <a-form-model style="width: 100%; height: 100%" :layout="model.layout"
                              :labelCol="model.labelCol" :wrapperCol="model.wrapperCol" :labelAlign="model.align">
                    <draggable :list="metas" :options="options" group="item" @add="onAddHandle"
                               :animation='200' :move="onMove" style="width: 100%; height: 100%; overflow-y: auto;">
                        <template v-for="item in metas">
                            <ivz-form-item :global="global" :key="item.id" :meta="item"
                                type="form" :span="24" :data-id="item.id" @delMetaItem="delMetaItem" />
                        </template>
                    </draggable>
                </a-form-model>
            </div>
        </a-modal>
    </div>
</template>
<!--模态框项-->
<script>
    import draggable from "vuedraggable";
    import IvzFormItem from "@/components/online/item/IvzFormItem";
    import EditMetas from "@/components/online/EditMetas";

    export default {
        name: "IvzModalItem",
        props: ['meta', 'global'],
        components: {draggable, IvzFormItem},
        data() {
            return {
                metas: [],
                model: null,
                visible: true,
                modalConfig: {},
                options: {
                    type: 'modal'
                }
            }
        },
        created() {
            if(!this.meta['model']) {
                this.model = EditMetas.getItemModel(this.meta.type);
                this.meta['model'] = this.model;
                this.meta['metas'] = this.metas;

                this.model['id'] = this.meta.id;
                this.model['permId'] = this.meta.id;
                this.model['type'] = this.meta.type;
                this.model['label'] = this.meta.name;
            } else {
                this.model = this.meta['model'];
                this.metas = this.meta['metas'];
            }

            this.activeHandle();
        },
        methods: {
            onMove(evt) { },
            onAddHandle() { },
            activeHandle() {
                if(this.visible) {
                    this.global.active = this.model.id;

                    // 最右侧的编辑模型和编辑项元数据
                    this.global.editModel = this.model;
                    this.global.editMetas = EditMetas.getItemMetas(this.meta.type);
                }
            },
            delMetaItem(meta) {
                this.metas.forEach((item, index) => {
                    if(item == meta) {
                        this.metas.splice(index, 1);
                        this.activeHandle();
                    }
                })
            },
            removeHandle() {
                this.$emit("remove", this.meta);
            },
            visibleHandle() {
                this.visible = true;
                this.activeHandle();
            },
            cancelHandle() {
                this.visible = false;
                this.activeHandle();
            },
            getModalContainer() {
                return this.$parent.$el;
            },
            getPermId() {
                return this.model['permId'] || this.model['id'];
            },
            resolverModalConfig() {
                this.modalConfig = {
                    metas: [],
                    id: this.model.id,
                    title: this.model.title,
                    width: this.model.length[1],
                    config: {
                        form: {
                            column: 1,
                            labelCol: this.model['labelCol'],
                            wrapperCol: this.model['wrapperCol']
                        },
                        keyboard: this.model.keyboard,
                        centered: this.model.centered,
                        closable: this.model.closable,
                        maskClosable: this.model.maskClosable,
                        bodyStyle: {height: this.model.length[0]+'px'}
                    }
                };
                this.metas.forEach((item, index) => {
                    let meta = EditMetas.resolverCommonItemToMeta(item.model, this.global);
                    this.modalConfig.metas.push(meta);
                })
                return this.modalConfig;
            },
            resolverHtmlTemplate() {
                let objName = this.model['permId'] || this.model.id;
                return `<ivz-modal-form ref="${objName+'Ref'}" :width="${objName}.width" :title="${objName}.title" :save-metas="{}" :metas="${objName}.metas" :config="${objName}.config"></ivz-modal-form>`
            },
            resolverJavaScript() {
                let objName = this.model['permId'] || this.model.id;
                return {
                    width: this.modalConfig.width,
                    title: this.modalConfig.title,
                    metas: this.modalConfig.metas,
                    config: this.modalConfig.config
                }
            },
        }
    }
</script>

<style scoped>
    .ivz-modal-item {

    }
    .ivz-mi-title {
        margin: 0px 3px;
    }
</style>
