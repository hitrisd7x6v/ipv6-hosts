<template>
    <a-locale-provider :locale="zhCN">
        <ivz-diy-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
           :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig"
           :data="data" v-show="listView">
            <template #search="{config, metas, model}">
                <slot name="search" :config="config" :metas="metas" :model="model"></slot>
            </template>
            <template #table="{config, metas, data}">
                <slot name="table" :config="config" :metas="metas" :data="data"></slot>
            </template>
        </ivz-diy-list>
        <ivz-diy-form ref="formRef" :action-metas="actionMetas"
              :form-config="formConfig" :form-group="formGroup">
            <template #default>
                <slot name="form"></slot>
            </template>
        </ivz-diy-form>
    </a-locale-provider>
</template>

<script>
    import Page from '../page.config'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    import IvzDiyList from "@/components/list/IvzDiyList";
    import {MixPageView} from "@/components/mixins/MixPageView";
    export default {
        name: 'IvzDiyView',
        components: {IvzDiyList},
        mixins: [MixPageView],
        props: [],
        data () {
            return {
                zhCN
            }
        },
        created () {
            let formMetas = Page.resolverFormMetas(this.metas, this.config.form, this)
        },
        mounted () {
            this.formRef = this.$refs['formRef']
        },
        methods: {
            setAddModel () {

            },
            setEditModel (editModel) {
                this.editModel = editModel
            },
            validate () {
                return this.formRef.validate()
            },
            submit () {

            },
            getOriEditModel () {

            },
            getSearchModel () {

            }
        }
    }
</script>

<style scoped>

</style>
