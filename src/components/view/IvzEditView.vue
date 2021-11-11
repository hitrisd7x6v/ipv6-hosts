<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-view ivz-edit-view ivz-container">
        <ivz-edit-list ref="listRef" :data="data" :action-metas="actionMetas" :table-config="tableConfig"
            :table-metas="tableMetas" :search-metas="searchMetas" :search-config="searchConfig"
            :table-alias-metas="tableAliasMetas">
            <template #action="{row, index}">
                <slot name="action" :row="row" :index="index"></slot>
            </template>
            <template v-for="meta in tableAliasMetas" #[meta.tableSlot]="{value, row, index}">
                <slot :name="meta.tableSlot" :value="value" :row="row" :index="index"></slot>
            </template>
        </ivz-edit-list>
        <ivz-drawer-detail ref="detailRef" :form-group="formGroup" :metas="metas"
                           v-if="detailVisible" :form-config="formConfig" :detail-config="detailConfig">
            <template #detail="{model}">
                <slot name="detail" :row="model"></slot>
            </template>
            <template v-for="meta in detailAliasMetas" #[meta.detailSlot]="{row}">
                <slot :name="meta.detailSlot" :meta="meta" :row="row"></slot>
            </template>
        </ivz-drawer-detail>
    </div>
    </a-locale-provider>
</template>

<script>
    import IvzEditList from '../list/IvzEditList'
    import {MixPageView} from '../mixins/MixPageView'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    import IvzDrawerDetail from "@/components/detail/IvzDrawerDetail";
    export default {
        name: 'IvzEditView',
        mixins: [MixPageView],
        components: {IvzEditList, IvzDrawerDetail},
        props: {},
        data () {
            return {
                zhCN
            }
        },
        created () { },
        methods: { }
    }
</script>

<style>
    .ivz-basic-search {
        margin-bottom: 12px;
        background-color: #ffffff;
    }
    .ivz-basic-search .ivz-search-bottom {
        padding: 6px 18px 2px 30px;
    }
    .ivz-basic-search .ant-form.ant-form-horivzontal {
        padding: 3px 8px 3px 12px;
    }
    .ivz-basic-search .ant-form-item {
        margin: 0px;
    }
    .ivz-edit-row td{
        height: 36px;
        padding: 2px 4px!important;
    }
</style>
