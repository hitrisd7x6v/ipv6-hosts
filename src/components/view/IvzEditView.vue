<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-view ivz-edit-view ivz-container">
        <ivz-edit-list ref="listRef" :data="data" :action-metas="actionMetas" :table-config="tableConfig"
            :table-metas="tableMetas" :search-metas="searchMetas" :search-config="searchConfig"></ivz-edit-list>
    </div>
    </a-locale-provider>
</template>

<script>
    import IvzEditList from '../list/IvzEditList'
    import {MixPageView} from '../mixins/MixPageView'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    export default {
        name: 'IvzEditView',
        mixins: [MixPageView],
        components: {IvzEditList},
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
