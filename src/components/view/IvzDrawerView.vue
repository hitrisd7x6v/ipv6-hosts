<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-view ivz-drawer-view ivz-container">
        <ivz-default-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
             :data="data" :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig">
            <template #action="{row, index}">
                <slot name="action" :row="row" :index="index"></slot>
            </template>
            <template v-for="meta in tableAliasMetas" #[meta.tableAlias]>
                <slot :name="meta.tableAlias" :meta="meta" :value="value" :row="row" :index="index"></slot>
            </template>
        </ivz-default-list>
        <ivz-drawer-form ref="formRef" :form-group="formGroup" :placement="placement" :visible="!listView"
             :height="height" :width="width" :action-metas="actionMetas" :form-config="formConfig">
            <template #default>
                <slot name="submit"></slot>
            </template>
            <template v-for="meta in formAliasMetas" #[meta.alias]>
                <slot :name="meta.alias" :meta="meta"></slot>
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

        },
        mounted () {},
        methods: {

        }
    }
</script>

<style scoped>

</style>
