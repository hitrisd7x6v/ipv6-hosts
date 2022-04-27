<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-form ivz-default-form ivz-border-radius">
        <a-affix :offsetTop="0" @change="affixChange">
            <a-row type="flex" align="middle" justify="space-between"
                   class="form-header ivz-border-radius" style="color: #000000">
                <a-col span="8" style="padding-left: 12px">
                    <span @click="cancelHandle" class="ivz-icon-back">
                        <a-icon type="arrow-left" style="font-size: 18px"/>
                    </span>
                    <em style="font-size: 16px; color: #000000">&nbsp;{{title}}</em>
                </a-col>
                <a-col span="8" style="text-align: center"></a-col>
                <a-col span="8" style="padding-right: 20px; text-align: right"></a-col>
            </a-row>
        </a-affix>
        <div class="form-body">
            <a-spin :tip="loadingText" :spinning="spinning">
                <ivz-group-form ref="basicFormRef" @mountedFinished="mountedFinished"
                    :form-group="formGroup" :form-config="formConfig">
                    <template v-for="meta in formAliasMetas" #[meta.formSlot]="{model}">
                        <slot :name="meta.formSlot" :model="model"></slot>
                    </template>
                </ivz-group-form>
            </a-spin>
        </div>
        <div class="form-footer ivz-opera-row" style="text-align: center">
            <slot name="submit" :model="editModel">
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
    import IvzGroupForm from "@/components/form/IvzGroupForm";
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    export default {
        mixins: [MixPageForm],
        name: 'IvzDefaultForm',
        props: {},
        components: {IvzGroupForm},
        data () {
            return {
                zhCN
            }
        },
        created () {},
        mounted () {},
        methods: {
            affixChange(affixed) {
                // alert(affixed);
            }
        }
    }
</script>

<style scoped>
    .ant-affix {
        left: 0px!important;
        width: 100%!important;
    }
    .ivz-default-form {
        margin-top: 5px;
        box-shadow: 0px 0px 5px 0px #fafafa;
    }
    .ivz-default-form .form-header {
        height: 48px;
        margin: 0px 0px 10px;
        background-color: #ffffff;
        border-bottom: 1px solid #efefef;
    }
    .form-header-left {
        width: 240px;
        height: 38px;
        padding-left: 6px;
        line-height: 38px;
    }
    .ivz-default-form .form-body {
        padding: 3px 0px;
        border-radius: 6px;
        border: 5px solid #ffffff;
        background-color: #ffffff;
    }
    .ivz-default-form .form-footer {
        padding: 8px;
    }
</style>
