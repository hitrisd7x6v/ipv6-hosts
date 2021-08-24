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
                <div v-for="group in formGroup" v-if="groupView(group)" :key="group.name" class="ivz-group" :style="group.style">
                    <div v-if="group.name" class="ivz-group-head">
                        <label style="color: #6eb5ff; font-size: 14px; padding-left: 12px;">{{group.name}}</label>
                    </div>
                    <div class="ivz-group-body">
                        <ivz-basic-form ref="basicFormRef" @mountedFinished="mountedFinished"
                            :metas="group.metas" :form-config="formConfig">
                            <template v-for="meta in group.metas" v-if="meta.formSlot">
                                <template :slot="meta.formSlot">
                                    <slot :name="meta.formSlot"></slot>
                                </template>
                            </template>
                        </ivz-basic-form>
                    </div>
                </div>
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
        border: 5px solid #ffffff;
        background-color: #fafafa;
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
