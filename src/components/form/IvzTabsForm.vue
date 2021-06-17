<template>
    <div class="ivz-tabs-form">
        <div class="ivz-tf-header">
            <span>{{tabsFormTitle}}</span>
        </div>
        <div class="ivz-tf-body">
            <div class="ivz-tf-body-content">
                <template v-for="(tab, key) in tabs">
                    <ivz-basic-form v-if="tab.type=='form'" :form-group="tab.formGroup" :layout="tab.layout"
                        :config="tab.config" :column="tab.column" class="ivz-tab-body" :key="key"
                        :hide-required-mark="tab.hideRequiredMark" :gutter="tab.gutter"></ivz-basic-form>
                    <ivz-edit-table v-else :metas="tab.metas" :config="tab.config" :key="key"
                        :options="tab.options" :data="tab.data" :ref="key" v-show="tab.activity"></ivz-edit-table>
                </template>
            </div>
        </div>
        <div class="ivz-tf-footer">
            这是底部
        </div>
    </div>
</template>

<script>
    import Page from '../page.config'

    export default {
        name: 'IvzTabsForm',
        props: ['title', 'tabs', 'config'],
        data () {
            return {
                tabsFormTitle: null
            }
        },
        created () {
            if (this.isBlank(this.tabs)) {
                throw new Error('没有指定tabs参数, 或者为空')
            }
            Object.keys(this.tabs).forEach(key => {
                let tab = this.tabs[key]
                // 初始化默认配置
                Page.izDefaultTabOptions(tab, this)

                // 初始化表单实体对象
                let formGroup = Page.resolverFormMetas(this.tab.metas, this)
                this.$set(tab, 'formGroup', formGroup)
            })
        },
        mounted () {
            let entries = Object.entries(this.tabs)
            for (let [key, tab] of entries) {
                this.$set(tab, 'ref', this.$refs[key][0])
                if (tab['activity'] === undefined) {
                    this.$set(tab, 'view', false)
                }
            }
        },
        methods: {
            activity (tabKey) {
                let values = Object.values(this.tabs)
                for (let tab in values) {
                    tab['activity'] = false
                }
                this.tabs[tabKey]['activity'] = true
            }
        }
    }
</script>

<style>
    .ivz-tabs-form {
        width: 100%;
        height: 100%;
    }
    .ivz-tabs-form .ivz-tf-header {
        top: 0px;
        width: 100%;
        height: 48px;
        padding: 8px;
        line-height: 33px;
        position: absolute;
        border-bottom: 1px solid #eaedf1;
    }
    .ivz-tabs-form .ivz-tf-body {
        width: 100%;
        height: 100%;
        padding: 48px 0px;
    }
    .ivz-tabs-form .ivz-tf-footer {
        bottom: 0px;
        width: 100%;
        height: 48px;
        line-height: 46px;
        position: absolute;
        border-top: 1px solid #eaedf1;
    }
    .ivz-tf-body-content {
        width: 100%;
        height: 100%;
        padding: 8px 3px;
        overflow: auto;
    }
</style>
