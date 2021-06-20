<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-default-form ivz-border-radius">
        <div class="form-header ivz-border-radius">
            <div class="form-header-left">
                <ivz-icon :type="operaMeta.icon" style="font-size: 17px"></ivz-icon>
                <em style="font-size: 16px; color: #000000">{{title}}</em>
            </div>
        </div>
        <div class="form-body">
            <a-spin :tip="loadingText" :spinning="spinning">
                <ivz-basic-form ref="basicFormRef" @mountedFinished="mountedFinished"
                    :form-group="formGroup" :bind-type="formConfig.bindType" :form-config="formConfig">
                    <template v-for="meta in formAliasMetas" #[meta.alias]>
                        <slot :name="meta.alias"></slot>
                    </template>
                </ivz-basic-form>
            </a-spin>
        </div>
        <div class="form-footer ivz-opera-row" style="text-align: center">
            <slot>
                <a-button class="ivz-button-action" @click="cancelHandle">返回</a-button>
                <a-button class="ivz-button-action" @click="submitHandle" type="primary">提交</a-button>
                <a-button class="ivz-button-action" @click="freshenHandle" type="dashed">刷新</a-button>
            </slot>
        </div>
    </div>
    </a-locale-provider>
</template>

<script>
    import {MixPageForm} from '../mixins/MixPageForm'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    export default {
        mixins: [MixPageForm],
        name: 'IvzDefaultForm',
        props: {},
        data () {
            return {
                zhCN
            }
        },
        created () {},
        mounted () {},
        methods: {

        }
    }
</script>

<style scoped>
    .ivz-default-form {
        background-color: #ffffff;
        margin-top: 16px;
        box-shadow: 0px 0px 5px 0px #fafafa;
    }
    .ivz-default-form .form-header {
        height: 38px;
        margin: 8px 0px 10px;
        background-color: #fafafa;
        border-left: 5px solid #606266;
    }
    .form-header-left {
        width: 240px;
        height: 38px;
        padding-left: 6px;
        line-height: 38px;
    }
    .ivz-default-form .form-body {
        padding: 3px 12px;
    }
    .ivz-default-form .form-footer {
        padding: 8px;
    }
</style>
