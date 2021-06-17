<template>
    <a-locale-provider :locale="zhCN">
        <div class="ivz-view ivz-diy-table-view ivz-container">
            <div v-show="listView" class="ivz-list ivz-default-list">
                <ivz-page-search :search-model="searchModel" :search-config="searchConfig"
                     :action-metas="actionMetas" :search-metas="searchMetas"></ivz-page-search>
                <ivz-basic-table :table-metas="tableMetas" :table-config="tableConfig"
                    ref="tableRef" :data="data" :search-model="searchModel" :action-metas="actionMetas">
                    <template v-for="meta in slotMetas" #[meta.field]="{row, index}">
                        <slot :name="meta.field" :row="row" :index="index" :meta="meta"></slot>
                    </template>
                    <template #action="{row, index}">
                        <slot name="action" :row="row" :index="index"></slot>
                    </template>
                </ivz-basic-table>
            </div>
            <ivz-default-form v-if="!listView" ref="formRef" :form-config="formConfig"
                  :form-group="formGroup" :action-metas="actionMetas">
                <template #default>
                    <slot name="submit"></slot>
                </template>
            </ivz-default-form>
        </div>
    </a-locale-provider>
</template>

<script>
    import {MixPageView} from "@/components/mixins/MixPageView";
    import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
    import {MixSplitList} from "@/components/mixins/MixSplitList";
    import IvzPageSearch from "@/components/form/IvzPageSearch";
    import IvzDefaultForm from "@/components/form/IvzDefaultForm";

    export default {
        name: "IvzSlotTableView",
        components: {IvzPageSearch, IvzDefaultForm},
        mixins: [MixPageView, MixSplitList],
        data() {
            return {
                zhCN,
                slotMetas: []
            }
        },
        created() {
            // 初始化表单实体对象
            this.formConfig = this.config.form;
            this.formGroup = this.$page.resolverFormMetas(this.metas, this.formConfig, this)
        },
        mounted() {
            this.listRef = this;
            this.slotMetas = this.$refs['tableRef'].slotMetas;
        }
    }
</script>

<style scoped>

</style>
