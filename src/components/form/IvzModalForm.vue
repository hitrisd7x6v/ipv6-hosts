<template>
    <a-modal class="ivz-modal-container ivz-modal-form" :get-container="$getModalContainer"
         :closable="config.closable" :centered="config.centered" :width="width"
         :mask-closable="config.maskClosable" ok-text="提交" cancel-text="取消" :visible="visible"
         :keyboard="config.keyboard" :maskStyle="config.maskStyle" :bodyStyle="config.bodyStyle">
        <div slot="title" style="text-align: center;">
            <i class="izc iz-icon-edit"></i> {{title}}
        </div>
        <a-spin :tip="submitTip" :spinning="spinning">
            <ivz-basic-form ref="basicForm" :form-config="formConfig" :ori-model="oriModel"
                        :field-meta-map="fieldMetaMap" :form-group="formGroup"></ivz-basic-form>
        </a-spin>
        <div slot="footer" style="text-align: center">
            <div>
                <a-button @click="cancel">取 消</a-button>
                <a-button @click="submit" :loading="spinning" type="primary">提 交</a-button>
                <a-button @click="reset" type="dashed">重 置</a-button>
            </div>
        </div>
    </a-modal>
</template>

<script>
    export default {
        name: 'IvzModalForm',
        props: {
            width: {default: 480},
            title: {type: String, default: '未指定标题'},
            metas: {type: Array, required: true},
            saveMeta: {type: Object, required: true},
            config: {type: Object, default: () => { return {} }}
        },
        data () {
            return {
                oriModel: {},
                submitTip: '',
                visible: false,
                spinning: false,
                formGroup: null,
                $basicForm: null,
                formConfig: null,
                fieldMetaMap: {}
            }
        },
        created () {
            if (!this.metas) return this.$log.errorLog('没有指定元数据', '指定元素据：metas')
            if (!this.config) return this.$log.errorLog('没有指定配置对象', '指定配置对象：config')
            if (!this.saveMeta) return this.$log.errorLog('没有指定操作元数据', '传入(props)saveMeta')

            this.formConfig = this.config.form || {}
            this.$utils.assignVueProperty(this.config, this.$resolver.modalOptions, this)

            this.submitTip = this.formConfig.submitTip
            this.$resolver.initDefaultFormConfig(this.formConfig, this)
            this.formGroup = this.$resolver.resolverFormMetas(this.metas, this.formConfig, this, meta=>{
                this.fieldMetaMap[meta.field] = meta;
                this.$resolver.resolverMetaDefaultValue(meta, this.oriModel);
            })
        },
        updated () {
            this.$basicForm = this.$refs['basicForm']
        },
        methods: {
            reset () {
                this.$basicForm.resetForm()
            },
            open (model) {
                this.visible = true
                this.$nextTick(() => {
                    let editModel = model || this.$basicForm.getOriFormModel()
                    this.$basicForm.setEditModel(editModel)
                })
            },
            cancel () {
                this.visible = false
            },
            getEditModel () {
                return this.$basicForm.getEditModel()
            },
            submit () {
                this.$basicForm.validate().then(resp => {
                    let editModel = this.$basicForm.getEditModel()
                    if (!this.saveMeta['url']) {
                        return this.$log.errorLog('保存元数据未指定Url', '指定saveMeta["url"]属性')
                    }
                    this.saveMeta.callBack(editModel).then(resp => {
                        this.spinning = true
                        let resolve = this.$utils.getPromiseResolve(resp)
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
            isEditMate () {
                return this.operaMate['id'] === 'edit'
            },
            trigger () {
                this.visible = !this.visible
            }
        }
    }
</script>

<style>
    .ivz-modal-form .ant-modal-body {
        overflow-y: auto;
    }
</style>
