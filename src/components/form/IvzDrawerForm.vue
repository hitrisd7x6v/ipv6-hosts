<template>
    <a-drawer ref="drawerRef" :width="drawerWidth" @close="drawerClose"
          :wrapStyle="{overflow: 'auto'}" :placement="placement"
          :closable="false" :mask-closable="maskClosable" :mask="mask"
          wrap-class-name="ivz-drawer-form-wrap" :height="height" :handle="handle"
              :destroyOnClose="true" :mask-style="{}" :visible="visible">
        <a-row slot="title" type="flex" align="middle" justify="space-between" style="color: #000000">
            <a-col span="12" style="padding-left: 12px; font-size: 17px">
                <ivz-icon :type="operaMeta.icon" style="font-size: 17px"></ivz-icon>
                <em style="font-size: 16px; color: #000000">{{title}}</em>
            </a-col>
            <a-col span="12" style="padding-right: 20px; text-align: right"></a-col>
        </a-row>
        <a-spin :tip="loadingText" :spinning="spinning">
            <ivz-basic-form :form-group="formGroup" :ori-model="oriModel"
                @mountedFinished="mountedFinished" :bind-type="formConfig.bindType"
                :form-config="formConfig" :field-meta-map="fieldMetaMap"></ivz-basic-form>
        </a-spin>
        <div class="ivz-opera-row" style="text-align: center">
            <slot>
                <a-button class="ivz-button-action" @click="cancelHandle">取消</a-button>
                <a-button class="ivz-button-action" @click="submitHandle" type="primary">提交</a-button>
                <a-button class="ivz-button-action" @click="freshenHandle" type="dashed">重置</a-button>
            </slot>
        </div>
    </a-drawer>
</template>

<script>
    import {MixPageForm} from '../mixins/MixPageForm'

    export default {
        mixins: [MixPageForm],
        name: 'IvzDrawerForm',
        props: {
            width: {default: null},
            height: {default: '38%'},
            visible: {type: Boolean, default: false},
            placement: {type: String, default: 'right'},
            drawerClose: {type: Function, default: () => {}}
        },
        data () {
            return {
                mask: false,
                handle: null,
                drawerWidth: 0, // 抽屉宽度
                maskClosable: false
            }
        },
        created () {
            if (this.width) {
                this.drawerWidth = this.width
            } else {
                if (this.formConfig.type === 'group') {
                    this.drawerWidth = (320 * this.formConfig.column) + 30
                } else {
                    this.drawerWidth = (380 * this.formConfig.column) + 50
                }
            }
        },
        mounted () { },
        methods: { }
    }
</script>

<style>

</style>
