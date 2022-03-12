<template>
    <a-locale-provider :locale="zhCN">
    <a-modal class="ivz-modal-container ivz-modal-form" :getContainer="$getModalContainer"
         :closable="config.closable" :centered="config.centered" :width="modalWidth"
         :mask-closable="config.maskClosable" :mask="config.mask" ok-text="提交" cancel-text="取消"
         :visible="visible" :keyboard="config.keyboard" :destroyOnClose="true"
         :maskStyle="config.maskStyle" :bodyStyle="config.bodyStyle" @cancel="cancel">
        <div slot="title" style="text-align: center;">
            <slot name="title">
                <i class="izc iz-icon-edit"></i> {{title}}
            </slot>
        </div>
        <a-spin :tip="submitTip" :spinning="spinning">
            <ivz-basic-model ref="basicFormRef" @mountedFinished="mountedFinished"
                             :metas="metas" :form-config="formConfig">
                <template v-for="meta in slotsMetas" #[meta.formSlot]>
                    <slot :name="meta.formSlot"></slot>
                </template>
            </ivz-basic-model>
        </a-spin>
        <template slot="footer">
            <slot name="footer">
                <div style="text-align: center">
                    <a-button @click="cancel">取 消</a-button>
                    <a-button @click="submit" :loading="spinning" type="primary">提 交</a-button>
                    <a-button @click="reset" type="dashed">重 置</a-button>
                </div>
            </slot>
        </template>
    </a-modal>
    </a-locale-provider>
</template>

<script>
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    export default {
        name: 'IvzModalForm',
        props: {
            width: {type: Number},
            title: {type: String, default: '未指定标题'},
            metas: {type: Array, required: true},
            saveMeta: {type: Object, required: true},
            config: {type: Object, default: () => { return {} }}
        },
        data () {
            return {
                zhCN,
                submitTip: '',
                editModel: {},
                modalWidth: 0,
                slotsMetas: [],
                visible: false,
                spinning: false,
                $basicForm: null,
                formConfig: null,
                fieldMetaMap: {},
                dateFieldMeta: [],
            }
        },
        created () {
            if (!this.metas) return this.$log.errorLog('没有指定元数据', '指定元素据：metas')
            if (!this.config) return this.$log.errorLog('没有指定配置对象', '指定配置对象：config')
            if (!this.saveMeta) return this.$log.errorLog('没有指定操作元数据', '传入(props)saveMeta')

            this.formConfig = this.config.form || {};
            this.$resolver.mergeDefaultObject(this.config, this.$resolver.modalOptions, this)

            this.submitTip = this.formConfig.submitTip;
            this.$resolver.initDefaultFormConfig(this.formConfig, this);
            if(this.formConfig.column > 1) {
                this.modalWidth = this.width || 320 * this.formConfig.column;
            } else {
                this.modalWidth = this.width || 420;
            }
            this.$resolver.resolverFormMetas(this.metas, this.formConfig, this, meta=>{
                this.fieldMetaMap[meta.field] = meta;
                if(this.$utils.isDate(meta.type)) {
                    this.dateFieldMeta.push(meta);
                    meta.config.getCalendarContainer = this.$getModalContainer;
                }

                if(meta.type == 'select' || meta.type == 'stree' || meta.type == 'cascade') {
                    meta.config.getPopupContainer = this.$getModalContainer;
                }
            })
        },
        mounted () {
            this.slotsMetas = this.$resolver.resolverFormSlots(this.fieldMetaMap, this.$scopedSlots);
        },
        methods: {
            reset () {
                this.$basicForm.resetForm()
            },
            open (model) {
                this.visible = true;
                this.editModel = model;
            },
            cancel () {
                this.visible = false
            },
            getOriModel() {
                return this.$basicForm.getOriModel();
            },
            getEditModel () {
                return this.$basicForm.getEditModel()
            },
            mountedFinished(basicFormRef) {
                this.$basicForm = basicFormRef;
                this.editModel = this.editModel || this.$basicForm.getOriModel();
                this.$basicForm.setEditModel(this.editModel);
            },
            getMeta(field) {
                return this.fieldMetaMap[field];
            },
            submit () {
                this.$basicForm.validate().then(resp => {
                    if (!this.saveMeta['url']) {
                        return this.$log.errorLog('保存元数据未指定Url', '指定saveMeta["url"]属性')
                    }

                    let editModel = this.$utils.clone(this.editModel);
                    this.saveMeta.callBack(editModel).then(resp => {
                        this.spinning = true;
                        let resolve = this.$utils.getPromiseResolve(resp);
                        this.$utils.formatDateForEditModel(this.dateFieldMeta, editModel);

                        this.$http.post(this.saveMeta.url, editModel).then(data => {
                            if (typeof resolve.success === 'function') {
                                resolve.success(data, this)
                            } else {
                                this.visible = false
                                this.$msg.successNotify('提交操作!', data['IzMsg'])
                            }
                        }).catch(reason => {
                            if (typeof resolve.fail === 'function') {
                                resolve.fail(reason, this)
                            } else {
                                this.$msg.errorNotify('提交操作!', reason)
                            }
                        }).finally(() => {
                            this.spinning = false
                        })
                    }).catch(reason => reason)
                }).catch(reason => {})
            },
            trigger () {
                this.visible = !this.visible
            }
        }
    }
</script>

<style>

</style>
