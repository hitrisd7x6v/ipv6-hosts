<template>
    <div class="ivz-view ivz-basic-view ivz-container">
        <ivz-default-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
              :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig"
              :data="data" v-show="listView">
            <template #search>
                <slot name="search"></slot>
            </template>
            <template #action="{row, index}">
                <slot name="action" :row="row" :index="index"></slot>
            </template>
        </ivz-default-list>
        <ivz-default-form v-if="!listView" ref="formRef" :form-config="formConfig"
              :form-group="formGroup" :action-metas="actionMetas">
            <template #default>
                <slot name="submit"></slot>
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
        created () {
            // 初始化表单实体对象
            this.formConfig = this.config.form;
            this.formGroup = this.$page.resolverFormMetas(this.metas, this.formConfig, this)
        },
        mounted () {

        },
        methods: {

        }
    }
</script>

<style scoped>

</style>
