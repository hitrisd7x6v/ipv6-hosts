<template>
    <a-locale-provider :locale="zhCN">
        <div class="ivz-view ivz-div-view ivz-container">
            <keep-alive>
                <router-view name="list">
                    <template #test>
                        <slot name="ktest"></slot>
                    </template>
                </router-view>
            </keep-alive>
            <router-view>
                <template #default>
                    <slot name="form"></slot>
                </template>
            </router-view>
        </div>
        <ivz-diy-list ref="listRef" :table-metas="tableMetas" :table-config="tableConfig"
           :action-metas="actionMetas" :search-metas="searchMetas" :search-config="searchConfig"
           :data="data" v-show="listView">
        </ivz-diy-list>
        <ivz-diy-form ref="formRef" :action-metas="actionMetas"
              :form-config="formConfig" :form-group="formGroup">
        </ivz-diy-form>
    </a-locale-provider>
</template>

<script>
    import Page from '@/components/page.config'
    import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
    import IvzDiyList from "@/components/list/IvzDiyList";
    import {MixPageView} from "@/components/mixins/MixPageView";
    import IvzDiyForm from "@/components/form/IvzDiyForm";
    import IvzDefaultList from "@/components/list/IvzDefaultList";
    export default {
        name: 'IvzDiyView',
        router: Page.router,
        components: {IvzDiyList, IvzDiyForm},
        mixins: [MixPageView],
        props: [],
        data () {
            return {
                zhCN,
                view: 'list'
            }
        },
        beforeCreate() {
            this.$router.addRoutes([{
                path: '/list', component: IvzDefaultList, props: () => {
                    return {
                        data: this.data,
                        tableMetas: this.tableMetas,
                        tableConfig: this.tableConfig,
                        actionMetas: this.actionMetas,
                        searchMetas: this.searchMetas,
                        searchConfig: this.searchConfig
                    }
                }
            },
                {
                    path: '/form', components: {
                        list: IvzDiyForm
                    }, props: {
                        list: ()=>{
                            return {

                            }
                        }
                    }
                }
            ])
        },
        created () {
            // let formMetas = Page.resolverFormMetas(this.metas, this.config.form, this)

        },
        mounted () {
            this.formRef = this.$refs['formRef']
        },
        activated() {
            console.log("list activated")
        },
        methods: {
            setAddModel () {

            },
            setEditModel (editModel) {
                this.editModel = editModel
            },
            validate () {
                return this.formRef.validate()
            },
            submit () {

            },
            getOriEditModel () {

            },
            getSearchModel () {

            }
        }
    }
</script>

<style scoped>

</style>
