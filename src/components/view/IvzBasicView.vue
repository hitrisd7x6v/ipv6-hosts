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
            <template v-for="meta in formAliasMetas" #[meta.formSlot]>
                <slot :name="meta.formSlot" :meta="meta"></slot>
            </template>
        </ivz-default-form>
    </div>
</template>

<script>
    import {MixPageView} from '../mixins/MixPageView'
    import IvzDefaultList from '../list/IvzDefaultList'
    import IvzDefaultForm from '../form/IvzDefaultForm'

    export default {
        name: 'IvzBasicView',
        mixins: [MixPageView],
        components: {IvzDefaultList, IvzDefaultForm},
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
