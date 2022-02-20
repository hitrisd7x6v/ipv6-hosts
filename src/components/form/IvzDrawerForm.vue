<template>
    <a-drawer ref="drawerRef" :width="drawerWidth" @close="drawerClose"
          :wrapStyle="{overflow: 'auto'}" :placement="placement"
          :closable="false" :mask-closable="maskClosable" :mask="mask"
          wrap-class-name="ivz-form ivz-drawer-form-wrap" :height="height"
              :destroyOnClose="true" :visible="visible">
        <a-row slot="title" type="flex" align="middle" justify="space-between" style="color: #000000">
            <a-col span="8">
                <span @click="cancelHandle" class="ivz-icon-back">
                    <a-icon type="arrow-left" style="font-size: 18px"/>
                </span>
                <em style="font-size: 16px; color: #000000">&nbsp;{{title}}</em>
            </a-col>
            <a-col span="8" style="text-align: center"></a-col>
            <a-col span="8" style="padding-right: 20px; text-align: right"></a-col>
        </a-row>
        <a-spin :tip="loadingText" :spinning="spinning">
            <ivz-group-form ref="basicFormRef" @mountedFinished="mountedFinished"
                            :form-group="formGroup" :form-config="formConfig">
                <template v-for="meta in formAliasMetas" #[meta.formSlot]="{model}">
                    <slot :name="meta.formSlot" :model="model"></slot>
                </template>
            </ivz-group-form>
        </a-spin>
        <div class="ivz-opera-row" style="text-align: center">
            <slot name="submit" :model="editModel">
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
            maskClosable: {type: Boolean, default: false}
        },
        watch: {
            visible(newVal) {
                if(newVal) {
                    // this.initEditModel();
                }
            }
        },
        data () {
            return {
                mask: true,
                handle: null,
                drawerWidth: 0, // 抽屉宽度
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
        methods: {
            getFormType() {
                return "Drawer";
            },
            drawerClose() {
                this.visible = false;
            }
        }
    }
</script>

<style>

</style>
