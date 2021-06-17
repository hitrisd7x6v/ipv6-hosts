<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-view ivz-drawer-view ivz-container">
        <ivz-default-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
             :data="data" :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig">
            <template #action="{row, index}">
                <slot name="action" :row="row" :index="index"></slot>
            </template>
        </ivz-default-list>
        <ivz-drawer-form ref="formRef" :form-group="formGroup" :placement="placement" :visible="!listView"
             :height="height" :width="width" :action-metas="actionMetas" :form-config="formConfig">
            <template #default>
                <slot name="submit"></slot>
            </template>
        </ivz-drawer-form>
    </div>
    </a-locale-provider>
</template>

<script>
    import {MixPageView} from '../mixins/MixPageView'
    import IvzDrawerForm from '../form/IvzDrawerForm'
    import IvzDefaultList from '../list/IvzDefaultList'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    export default {
        name: 'IvzDrawerView',
        mixins: [MixPageView],
        components: {IvzDefaultList, IvzDrawerForm},
        props: {
            width: {},
            height: {},
            placement: {type: String, default: 'right'}
        },
        data () {
            return {
                zhCN,
                formRef: null,
                drawerOptions: {}
            }
        },
        created () {
            // 初始化表单实体对象
            this.formConfig = this.config.form
            this.formGroup = this.$page.resolverFormMetas(this.metas, this.formConfig, this)
        },
        mounted () {},
        methods: {

        }
    }
</script>

<style scoped>

</style>
