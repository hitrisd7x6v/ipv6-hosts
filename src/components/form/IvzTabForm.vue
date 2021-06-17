<template>
    <div class="ivz-tab-form">
        <ivz-basic-form :form-group="formGroup" :layout="tab.layout"
            :config="tab.config" :column="tab.column" class="ivz-tab-body"
            :hide-required-mark="tab.hideRequiredMark" :gutter="tab.gutter"></ivz-basic-form>
        <div class="ivz-tab-footer"></div>
    </div>
</template>

<script>
    import Page from '../page.config'

    export default {
        name: 'IvzTabForm',
        props: ['tab'],
        data () {
            return {
                formGroup: null
            }
        },
        created () {
            // 初始化默认配置
            Page.izDefaultTabOptions(this.tab, this)
            // 初始化表单实体对象
            this.formGroup = Page.resolverFormMetas(this.tab.metas, this)
        }
    }
</script>

<style>
    .ivz-tab-form {
        padding: 3px 32px 3px 8px;
    }
</style>
