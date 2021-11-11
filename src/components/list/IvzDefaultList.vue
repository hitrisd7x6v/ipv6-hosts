<!-- 默认列表页, 有搜索组件和表组件组成 -->
<template>
    <a-locale-provider :locale="zhCN">
        <div class="ivz-list ivz-default-list">
            <ivz-page-search :search-model="searchModel" :search-config="searchConfig"
                :action-metas="actionMetas" :search-metas="searchMetas"></ivz-page-search>
            <ivz-basic-table ref="tableRef" :table-metas="tableMetas" :table-config="tableConfig"
                    :data="data" :search-model="searchModel" :action-metas="actionMetas" @heightChange="setTableHeight">
                <template #action="{row, index}">
                    <slot name="action" :row="row" :index="index"></slot>
                </template>
                <template v-for="meta in tableAliasMetas" #[meta.tableSlot]="{value, row, index}">
                    <slot :name="meta.tableSlot" :value="value" :row="row" :index="index"></slot>
                </template>
            </ivz-basic-table>
        </div>
    </a-locale-provider>
</template>

<script>
    import {MixPageList} from '../mixins/MixPageList'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    import IvzPageSearch from "@/components/form/IvzPageSearch";

    export default {
        components: {IvzPageSearch},
        mixins: [MixPageList],
        name: 'IvzDefaultList',
        props: {},
        data () {
            return {
                zhCN
            }
        },
        created () { },
        mounted () { },
        methods: {

        }
    }
</script>

<style scoped>

</style>
