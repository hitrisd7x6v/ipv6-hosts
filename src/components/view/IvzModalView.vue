<template>
    <div class="iz-view-basic-table iz-container">
        <ivz-search-form ref="bs" :search-mates="searchMates"
             :config="config" :layout="[2, 4]" @action-click="operaClick"></ivz-search-form>
        <ivz-basic-table ref="basicTableRef" :metas="mates" :config="config" :height="height"
            style="margin-top: 8px" :options="options" :data="data" @opera-click="operaClick"></ivz-basic-table>
        <ivz-modal-form ref="formRef" :form-mates="mates" @on-opera="operaHandle"></ivz-modal-form>
    </div>
</template>

<script>
    import PageOptions from '../page.config'
    import Resolver from "@/utils/resolver.utils";
    export default {
        name: 'IvzModalView',
        components: {},
        props: {
            formType: {type: String, default: 'default'},
            data: {type: Array, default: () => { return [] }},
            mates: {type: Array, default: () => { return [] }},
            config: {type: Object, default: () => { return {} }},
            options: {type: Object, default: () => { return {} }},
            searchMates: {type: Array, default: () => { return [] }},
            actionMates: {type: Object, default: () => { return {} }}
        },
        data () {
            return {
                height: null,
                formRef: null,
                saveMate: null,
                searchModel: null,
                drawerOptions: {},
                basicTableRef: null,
                basicSearchRef: null
            }
        },
        created () {
            if (this.isBlank(this.actionMates)) {
                this.$log.warningLog('功能按钮初始化', '未初始化功能按钮元数据', this.actionMates)
            }

            this.saveMate = this.actionMates.Save
            PageOptions.resolverMetas(this.mates, (item, index, ori) => {
                Resolver.initCommonMate(item, this) // 初始化通用的元数据
            })
        },
        mounted () {
            this.formRef = this.$refs['formRef']
            this.basicTableRef = this.$refs['basicTableRef']
            this.height = 'calc(100vh - 192px)'
            this.basicTableRef.$el
                .querySelectorAll('.ant-table-body,.ant-table-body-outer')
                .forEach(item => {
                    item.style.height = 'calc(100vh - 192px)'
                })
            this.basicSearchRef = this.$refs['bs']
            this.searchModel = this.basicSearchRef.getSearchModel()
            this.setActionMates(this.actionMates)
            this.basicTableRef.query(this.searchModel)
        },
        methods: {
            operaHandle (type, param) {
                let $formRef = param['$this']
                if (type === 'freshen') {
                    // this.$basicTable.query();
                } else if (type === 'cancel') {
                    if ($formRef.operaMate === this.actionMates.Edit) {
                        this.basicTableRef.query()
                    }
                    $formRef.trigger()
                } else if (type === 'submit') {
                    this.basicTableRef.query()
                    $formRef.trigger()
                }
            },
            setActionMates (actionMates) {
                this.actionMates = actionMates
                this.basicTableRef.setActionMates(this.actionMates)
                this.basicSearchRef.setActionMates(this.actionMates)
            },
            operaClick (mate, value, title) {
                let id = mate['id']
                switch (id) {
                    case 'add': this.formRef.addModel(value, mate, title); break
                    case 'edit': this.formRef.editModel(value, mate, title); break
                    case 'query': this.basicTableRef.query(this.searchModel); break
                }
            }
        }
    }
</script>

<style scoped>

</style>
