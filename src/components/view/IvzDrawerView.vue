<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-view ivz-drawer-view ivz-container">
        <ivz-default-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
             :data="data" :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig">
            <template #action="{row, index}">
                <slot name="action" :row="row" :index="index"></slot>
            </template>
            <template v-for="meta in tableAliasMetas" #[meta.tableSlot]>
                <slot :name="meta.tableSlot" :meta="meta" :value="value" :row="row" :index="index"></slot>
            </template>
        </ivz-default-list>
        <ivz-drawer-form ref="formRef" :form-group="formGroup" :placement="placement" :visible="!listView"
             :height="height" :width="width" :action-metas="actionMetas" :form-config="formConfig">
            <template #default>
                <slot name="submit"></slot>
            </template>
            <template v-for="meta in formAliasMetas" #[meta.formSlot]>
                <slot :name="meta.formSlot" :meta="meta"></slot>
            </template>
        </ivz-drawer-form>
        <ivz-drawer-detail ref="detailRef" :form-group="formGroup"
               v-if="detailVisible" :form-config="formConfig" :detail-config="detailConfig">
            <template v-for="meta in detailAliasMetas" #[meta.detailSlot]="{row}">
                <slot :name="meta.detailSlot" :meta="meta" :row="row"></slot>
            </template>
        </ivz-drawer-detail>
    </div>
    </a-locale-provider>
</template>

<script>
    import {MixPageView} from '../mixins/MixPageView'
    import IvzDrawerForm from '../form/IvzDrawerForm'
    import IvzDefaultList from '../list/IvzDefaultList'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    import IvzDrawerDetail from "@/components/detail/IvzDrawerDetail";
    export default {
        name: 'IvzDrawerView',
        mixins: [MixPageView],
        components: {IvzDefaultList, IvzDrawerForm, IvzDrawerDetail},
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
