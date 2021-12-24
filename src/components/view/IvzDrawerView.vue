<template>
    <a-locale-provider :locale="zhCN">
    <div class="ivz-view ivz-drawer-view ivz-container">
        <ivz-default-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
             :data="data" :action-metas="actionMetas" :search-metas="searchMetas"
              :search-config="searchConfig" :table-alias-metas="tableAliasMetas">
            <template #search="{model}">
                <slot name="search" :model="model"></slot>
            </template>
            <template #action="params">
                <slot name="action" :row="params.row" :index="params.index"></slot>
            </template>
            <template v-for="meta in tableAliasMetas" #[meta.tableSlot]="params">
                <slot :name="meta.tableSlot" :meta="meta" :value="params.value"
                      :row="params.row" :index="params.index"></slot>
            </template>
        </ivz-default-list>
        <ivz-drawer-form ref="formRef" :form-group="formGroup" :visible="!listView"
             :height="height" :width="width" :placement="placement" :action-metas="actionMetas"
             :form-alias-metas="formAliasMetas" :form-config="formConfig" :mask-closable="maskClosable">
            <template #default>
                <slot name="submit"></slot>
            </template>
            <template v-for="meta in formAliasMetas" #[meta.formSlot]="{model}">
                <slot :name="meta.formSlot" :meta="meta" :model="model"></slot>
            </template>
        </ivz-drawer-form>
        <ivz-drawer-detail ref="detailRef" :form-group="formGroup"
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
            width: {type: String},
            height: {type: String},
            placement: {type: String, default: 'right'},
            maskClosable: {type: Boolean, default: false}
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
