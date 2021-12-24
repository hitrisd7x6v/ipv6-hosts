<!-- 可编辑列表页, 有搜索组件和编辑表组件组成 -->
<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-list ivz-edit-list">
        <ivz-page-search :search-model="searchModel" :search-config="searchConfig"
             :action-metas="actionMetas" :search-metas="searchMetas"></ivz-page-search>
        <ivz-edit-table ref="tableRef" :table-metas="tableMetas" :table-config="tableConfig"
            :action-metas="actionMetas" :search-model="searchModel" :data="data" @heightChange="setTableHeight">
            <template #action="{row, index}">
                <slot name="action" :row="row" :index="index"></slot>
            </template>
            <template v-for="meta in tableAliasMetas" #[meta.tableSlot]="{value, row, index}">
                <slot :name="meta.tableSlot" :value="value" :row="row" :index="index"></slot>
            </template>
        </ivz-edit-table>
    </div>
    </a-locale-provider>
</template>

<script>
    import {MixPageList} from '../mixins/MixPageList'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    import IvzPageSearch from "@/components/form/IvzPageSearch";
    import Resolver from "@/utils/resolver.utils";

export default {
    name: 'IvzEditList',
    mixins: [MixPageList],
    components: {IvzPageSearch},
    props: {},
    data () {
        return {
            zhCN,
            addMate: null, // 新增元数据
            editMate: null, // 编辑元数据
            queryMate: null, // 查询元数据
            oriModel: {EditableFlag: true}
        }
    },
    created () { },
    methods: {
        // 注册动作 action(String)
        register (actionMate) {
            if (!actionMate || !actionMate.id) {
                return this.$log.errorLog('注册功能点失败, 不存在或者没有指定id', '请传入正确的功能点对象', actionMate)
            }

            let key = this.$utils.firstUpperCase(actionMate.id)
            if (this.actionMetaKeys.includes(key)) return

            this.actionMetaKeys.push(key)

            if (key === 'View') {
                this.queryMate = actionMate
            } else if (key === 'Add') {
                this.addMate = actionMate
                this.addMate['position'] = 'M'
            } else if (key === 'Edit') {
                this.editMate = actionMate
            } else if (key === 'Save' || key === 'Cancel') {
                actionMate['position'] = 'T'
            }

            Resolver.registerPosition('search', actionMate, this.searchMainMetas, this.searchMoreMetas)
        }
    }
}
</script>

<style scoped>
    .ivz-edit-row td{
        height: 36px;
        padding: 2px 4px!important;
    }
</style>
