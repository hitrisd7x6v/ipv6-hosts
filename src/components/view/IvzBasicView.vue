<template>
    <div class="ivz-view ivz-basic-view ivz-container">
        <ivz-default-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
              :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig"
              :data="data" v-show="listView" :table-alias-metas="tableAliasMetas">
            <template #search>
                <slot name="search"></slot>
            </template>
            <template #action="{row, index}">
                <slot name="action" :row="row" :index="index"></slot>
            </template>
            <template v-for="meta in tableAliasMetas" #[meta.tableSlot]="{value, row, index}">
                <slot :name="meta.tableSlot" :meta="meta" :value="value" :row="row" :index="index"></slot>
            </template>
        </ivz-default-list>
        <ivz-default-form v-if="!listView" ref="formRef" :form-config="formConfig"
              :form-group="formGroup" :action-metas="actionMetas" :form-alias-metas="formAliasMetas">
            <template #submit>
                <slot name="submit"></slot>
            </template>
            <template v-for="meta in formAliasMetas" #[meta.formSlot]="{model}">
                <slot :name="meta.formSlot" :meta="meta" :model="model"></slot>
            </template>
        </ivz-default-form>
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
</template>

<script>
    import {MixPageView} from '../mixins/MixPageView'
    import IvzDefaultList from '../list/IvzDefaultList'
    import IvzDefaultForm from '../form/IvzDefaultForm'
    import IvzDrawerDetail from "@/components/detail/IvzDrawerDetail";
    export default {
        name: 'IvzBasicView',
        mixins: [MixPageView],
        components: {IvzDrawerDetail, IvzDefaultList, IvzDefaultForm},
        data () {
            return {}
        },
        created () { },
        mounted () { },
        methods: { }
    }
</script>

<style scoped>

</style>
